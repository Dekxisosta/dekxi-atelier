import { notFound } from "next/navigation";
import { MootDetailPage } from "@views/moot-detail";
import { getFriendById } from "@entities/friend/model/queries";

export const dynamic = "force-dynamic";

export default async function MootDetailRoute({
  params,
}: {
  params: { id: string };
}) {
  const friend = await getFriendById(params.id);
  if (!friend) notFound();

  return <MootDetailPage friend={friend} />;
}
