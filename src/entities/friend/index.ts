// Public API for the friend entity
// NOTE: Server-only queries (getFriends, getFriendById) are intentionally NOT
// exported here. Server components import them directly:
//   import { getFriends } from "@entities/friend/model/queries"
export type { Friend, FriendLink, FriendFormState } from "./model/types";
export { emptyFriendForm, parseLinks, linksToText } from "./model/types";
export { FriendAvatar, FriendLinks, FRIEND_LINK_ICON_MAP } from "./ui/index";
