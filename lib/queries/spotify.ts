export interface SpotifyTrack {
  title: string;
  artist: string;
  albumArt: string;
  songUrl: string;
  playedAt?: string;
}

export interface SpotifyTrackData {
  isPlaying: boolean;
  nowPlaying?: SpotifyTrack;
  recentlyPlayed: SpotifyTrack[];
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Spotify token refresh failed:", res.status, errorBody);
    throw new Error("Failed to refresh Spotify access token");
    }

  const json = await res.json();
  return json.access_token;
}

function mapTrackItem(item: any): SpotifyTrack {
  return {
    title: item.name,
    artist: item.artists?.map((a: any) => a.name).join(", "),
    albumArt: item.album?.images?.[0]?.url,
    songUrl: item.external_urls?.spotify,
  };
}

export async function getSpotifyData(): Promise<SpotifyTrackData> {
  const accessToken = await getAccessToken();

  const [nowRes, recentRes] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }),
    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=5", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }),
  ]);

  let isPlaying = false;
  let nowPlaying: SpotifyTrack | undefined;

  if (nowRes.status !== 204 && nowRes.status !== 202 && nowRes.ok) {
    const nowJson = await nowRes.json();
    if (nowJson?.item) {
      isPlaying = nowJson.is_playing;
      nowPlaying = mapTrackItem(nowJson.item);
    }
  }

  let recentlyPlayed: SpotifyTrack[] = [];
  if (recentRes.ok) {
    const recentJson = await recentRes.json();
    recentlyPlayed = (recentJson?.items ?? []).map((entry: any) => ({
      ...mapTrackItem(entry.track),
      playedAt: entry.played_at,
    }));
  }

  return { isPlaying, nowPlaying, recentlyPlayed };
}