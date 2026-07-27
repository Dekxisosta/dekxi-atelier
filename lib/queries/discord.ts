export interface DiscordActivity {
  name: string;
  type: number;
  details?: string;
  state?: string;
}

export interface DiscordStatusData {
  status: "online" | "idle" | "dnd" | "offline";
  username: string;
  avatar: string;
  customStatus?: string;
  activity?: DiscordActivity;
}

export async function getDiscordStatus(): Promise<DiscordStatusData> {
  const userId = process.env.DISCORD_USER_ID;

  if (!userId) {
    throw new Error("Missing Discord user ID");
  }

  const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
    next: { revalidate: 15 },
  });

  if (!res.ok) {
    throw new Error("Lanyard API error");
  }

  const json = await res.json();

  if (!json?.success) {
    throw new Error("User not found in Lanyard — make sure you've joined the Lanyard Discord server");
  }

  const d = json.data;
  const activities = d.activities ?? [];

  // type 4 = custom status text
  const customStatusActivity = activities.find((a: any) => a.type === 4);

  // type 2 = Spotify (already have a dedicated widget for this — skip)
  // pick the first non-custom, non-Spotify activity (e.g. VS Code, games)
  const mainActivity = activities.find(
    (a: any) => a.type !== 4 && a.type !== 2
  );

  return {
    status: d.discord_status,
    username: d.discord_user.global_name ?? d.discord_user.username,
    avatar: `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png`,
    customStatus: customStatusActivity?.state,
    activity: mainActivity
      ? {
          name: mainActivity.name,
          type: mainActivity.type,
          details: mainActivity.details,
          state: mainActivity.state,
        }
      : undefined,
  };
}