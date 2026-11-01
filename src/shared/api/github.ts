export interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

export interface GithubContributionData {
  totalContributions: number;
  weeks: ContributionDay[][];
}

export async function getGithubContributions(): Promise<GithubContributionData> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  if (!token || !username) throw new Error("Missing GitHub token or username");

  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { userName: username } }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("GitHub API error");

  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("No contribution data returned");

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks.map((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        color: day.color,
      }))
    ),
  };
}

export const GITHUB_USERNAME = "Dekxisosta";

export interface GithubCollaborator {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  pushedAt: string;
  /** Images found inside docs/, docus/, documents/, screenshots/ (max 6). */
  images: string[];
  /** Other contributors to the repo (owner and bots excluded, max MAX_COLLABORATORS). */
  collaborators: GithubCollaborator[];
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif)$/i;
const DOC_DIRS = new Set(["docs", "docus", "documents", "screenshots"]);
const MAX_IMAGES = 6;
const MAX_COLLABORATORS = 10;
const MIN_BYTES = 2 * 1024;
const MAX_BYTES = 8 * 1024 * 1024;

/** Scan a repo's git tree for images inside docs/docus/documents/screenshots folders. */
async function getRepoImages(
  repoName: string,
  branch: string,
  headers: Record<string, string>
): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
      { headers, next: { revalidate: 900 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const tree: { path: string; type: string; size?: number }[] = json?.tree ?? [];

    const found = tree
      .filter((n) => {
        if (n.type !== "blob" || !IMAGE_EXT.test(n.path)) return false;
        if (/favicon/i.test(n.path)) return false;
        if (n.size !== undefined && (n.size < MIN_BYTES || n.size > MAX_BYTES)) return false;
        const parts = n.path.split("/");
        if (parts.slice(0, -1).some((d) => d.toLowerCase() === "assets")) return false; // skip any assets/ folder
        if (parts.length === 1) return false; // skip repo root images
        return DOC_DIRS.has(parts[0].toLowerCase()); // docs/docus/documents/screenshots (any depth)
      })
      .map((n) => n.path)
      // shallower paths first, then alphabetical
      .sort((a, b) => {
        const da = a.split("/").length, db = b.split("/").length;
        return da - db || a.localeCompare(b);
      })
      .slice(0, MAX_IMAGES);

    return found.map(
      (path) =>
        `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${encodeURIComponent(branch)}/${path
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`
    );
  } catch {
    return [];
  }
}

/** Contributors of a repo (public endpoint), excluding the owner and bots, capped at MAX_COLLABORATORS. */
async function getRepoCollaborators(
  repoName: string,
  headers: Record<string, string>
): Promise<GithubCollaborator[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contributors?per_page=${MAX_COLLABORATORS + 5}`,
      { headers, next: { revalidate: 900 } }
    );
    if (!res.ok) return []; // 204 (empty repo) and errors both land here
    const json: any[] = await res.json();
    if (!Array.isArray(json)) return [];
    return json
      .filter((c) => c.type !== "Bot" && c.login?.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
      .slice(0, MAX_COLLABORATORS)
      .map((c) => ({ login: c.login, avatarUrl: c.avatar_url, url: c.html_url }));
  } catch {
    return [];
  }
}

/** Public repositories of GITHUB_USERNAME: repos with images first, then the rest, each group most recently pushed first. */
export async function getGithubRepos(limit = 100): Promise<GithubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // optional: a token only raises the rate limit (60/h unauthenticated)
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&type=owner&per_page=100`,
    { headers, next: { revalidate: 900 } }
  );
  if (!res.ok) throw new Error(`GitHub API error (${res.status})`);

  const json: any[] = await res.json();
  const picked = json
    .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
    .slice(0, limit);

  const [imageLists, collaboratorLists] = await Promise.all([
    Promise.all(picked.map((r) => getRepoImages(r.name, r.default_branch ?? "main", headers))),
    Promise.all(picked.map((r) => getRepoCollaborators(r.name, headers))),
  ]);

  const mapped = picked.map((r, i) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? null,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language ?? null,
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
      images: imageLists[i],
      collaborators: collaboratorLists[i],
    }));

  // repos with images first; Array.sort is stable so pushed-date order is kept within each group
  return mapped.sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0));
}

export interface GithubStats {
  /** Repositories owned by the user (drives the level). */
  repos: number;
  /** Commits across every year of the account (drives the XP). */
  commits: number;
  pullRequests: number;
  issues: number;
  followers: number;
}

async function githubGraphql<T>(query: string, variables: Record<string, string>, token: string): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("GitHub API error");
  const json = await res.json();
  if (json.errors?.length || !json.data) throw new Error(json.errors?.[0]?.message ?? "No data returned");
  return json.data as T;
}

/** Repo count, all-time commit count and a few profile totals. */
export async function getGithubStats(): Promise<GithubStats> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || GITHUB_USERNAME;
  if (!token) throw new Error("Missing GitHub token");

  const base = await githubGraphql<any>(
    `query($u: String!) {
      user(login: $u) {
        followers { totalCount }
        pullRequests { totalCount }
        issues { totalCount }
        repositories(ownerAffiliation: OWNER) { totalCount }
        contributionsCollection { contributionYears }
      }
    }`,
    { u: username },
    token
  );
  const user = base.user;
  if (!user) throw new Error("GitHub user not found");

  // contributionsCollection only spans one year at a time, so sum every year of the account
  const years: number[] = user.contributionsCollection.contributionYears;
  const perYear = years
    .map(
      (y) =>
        `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") { totalCommitContributions }`
    )
    .join("\n");
  const yearly = await githubGraphql<any>(
    `query($u: String!) { user(login: $u) { ${perYear} } }`,
    { u: username },
    token
  );
  const commits = years.reduce((sum, y) => sum + (yearly.user[`y${y}`]?.totalCommitContributions ?? 0), 0);

  return {
    repos: user.repositories.totalCount,
    commits,
    pullRequests: user.pullRequests.totalCount,
    issues: user.issues.totalCount,
    followers: user.followers.totalCount,
  };
}

