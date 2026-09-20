export interface DiscordActivity {
  name: string;
  type: number;
  details?: string;
  state?: string;
  largeImageUrl?: string;
  largeText?: string;
  smallImageUrl?: string;
  smallText?: string;
}

export interface DiscordStatusData {
  status: "online" | "idle" | "dnd" | "offline";
  username: string;
  avatar: string;
  customStatus?: string;
  activities: DiscordActivity[];
  guildTag?: string;
  guildBadgeUrl?: string;
}

function resolveAssetUrl(
  applicationId: string | undefined,
  image: string | undefined
): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${image.split(":")[1]}`;
  }
  if (applicationId) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${image}.png`;
  }
  return undefined;
}

export async function getDiscordStatus(): Promise<DiscordStatusData> {
  const userId = process.env.DISCORD_USER_ID;
  if (!userId) throw new Error("Missing Discord user ID");

  const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
    next: { revalidate: 15 },
  });
  if (!res.ok) throw new Error("Lanyard API error");

  const json = await res.json();
  if (!json?.success) {
    throw new Error(
      "User not found in Lanyard — make sure you've joined the Lanyard Discord server"
    );
  }

  const d = json.data;
  const activities = d.activities ?? [];
  const customStatusActivity = activities.find((a: any) => a.type === 4);
  const otherActivities = activities.filter((a: any) => a.type !== 4 && a.type !== 2);
  const primaryGuild = d.discord_user.primary_guild;

  return {
    status: d.discord_status,
    username: d.discord_user.global_name ?? d.discord_user.username,
    avatar: `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png`,
    customStatus: customStatusActivity?.state,
    activities: otherActivities.map((a: any) => ({
      name: a.name,
      type: a.type,
      details: a.details,
      state: a.state,
      largeImageUrl: resolveAssetUrl(a.application_id, a.assets?.large_image),
      largeText: a.assets?.large_text,
      smallImageUrl: resolveAssetUrl(a.application_id, a.assets?.small_image),
      smallText: a.assets?.small_text,
    })),
    guildTag: primaryGuild?.identity_enabled ? primaryGuild.tag : undefined,
    guildBadgeUrl: primaryGuild?.identity_enabled
      ? `https://cdn.discordapp.com/clan-badges/${primaryGuild.identity_guild_id}/${primaryGuild.badge}.png`
      : undefined,
  };
}
