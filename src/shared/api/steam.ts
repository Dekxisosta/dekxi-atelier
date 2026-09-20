const STATUS_MAP: Record<number, string> = {
  0: "Offline",
  1: "Online",
  2: "Busy",
  3: "Away",
  4: "Snooze",
  5: "Looking to trade",
  6: "Looking to play",
};

export interface RecentGame {
  appid: number;
  name: string;
  playtime_2weeks?: number;
  playtime_forever: number;
  img_icon_url: string;
}

export interface SteamPlayerData {
  name: string;
  avatar: string;
  status: string;
  game?: string | null;
  profileUrl: string;
  countryCode?: string | null;
  level: number;
  lastLogoff?: number | null;
  recentGames: RecentGame[];
}

const RECENT_GAMES_LIMIT = 5;

export async function getSteamPlayerSummary(steamid?: string): Promise<SteamPlayerData> {
  const id = steamid ?? process.env.STEAM_ID;
  const apiKey = process.env.STEAM_API_KEY;
  if (!id || !apiKey) throw new Error("Missing steamid or API key");

  const summaryUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${id}`;
  const recentUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${id}&count=${RECENT_GAMES_LIMIT}`;
  const levelUrl = `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${id}`;

  const [summaryRes, recentRes, levelRes] = await Promise.all([
    fetch(summaryUrl, { next: { revalidate: 30 } }),
    fetch(recentUrl, { next: { revalidate: 30 } }),
    fetch(levelUrl, { next: { revalidate: 30 } }),
  ]);

  if (!summaryRes.ok) throw new Error("Steam API error");
  const summaryJson = await summaryRes.json();
  const player = summaryJson?.response?.players?.[0];
  if (!player) throw new Error("Player not found");

  let recentGames: RecentGame[] = [];
  if (recentRes.ok) {
    const recentJson = await recentRes.json();
    recentGames = recentJson?.response?.games ?? [];
  }

  if (recentGames.length < RECENT_GAMES_LIMIT) {
    const ownedUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${id}&include_appinfo=1&include_played_free_games=1`;
    const ownedRes = await fetch(ownedUrl, { next: { revalidate: 30 } });
    if (ownedRes.ok) {
      const ownedJson = await ownedRes.json();
      const ownedGames = ownedJson?.response?.games ?? [];
      const existingIds = new Set(recentGames.map((g) => g.appid));
      const needed = RECENT_GAMES_LIMIT - recentGames.length;
      const filler = ownedGames
        .filter((g: any) => !existingIds.has(g.appid) && g.rtime_last_played)
        .sort((a: any, b: any) => b.rtime_last_played - a.rtime_last_played)
        .slice(0, needed)
        .map((g: any) => ({
          appid: g.appid,
          name: g.name,
          playtime_forever: g.playtime_forever,
          img_icon_url: g.img_icon_url,
        }));
      recentGames = [...recentGames, ...filler];
    }
  }

  let level = 0;
  if (levelRes.ok) {
    const levelJson = await levelRes.json();
    level = levelJson?.response?.player_level ?? 0;
  }

  return {
    name: player.personaname,
    avatar: player.avatarfull,
    status: STATUS_MAP[player.personastate] ?? "Unknown",
    game: player.gameextrainfo ?? null,
    profileUrl: player.profileurl,
    countryCode: player.loccountrycode ?? null,
    level,
    lastLogoff: player.lastlogoff ?? null,
    recentGames,
  };
}
