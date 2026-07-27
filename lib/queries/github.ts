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

  if (!token || !username) {
    throw new Error("Missing GitHub token or username");
  }

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

  if (!res.ok) {
    throw new Error("GitHub API error");
  }

  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    throw new Error("No contribution data returned");
  }

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