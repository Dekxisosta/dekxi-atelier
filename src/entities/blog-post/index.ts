// Public API for the blog-post entity
// NOTE: Server-only queries (getPosts, getPostBySlug) are intentionally NOT
// exported here — importing them through this barrel would pull next/headers
// into client bundles. Server components import them directly:
//   import { getPosts } from "@entities/blog-post/model/queries"
export type { BlogPost, Attachment, BlogFormState } from "./model/types";
export { emptyBlogForm, LATEST_BLOGS } from "./model/types";
export {
  BlogEntryCard,
  BlogPostHeader,
  BlogPostContent,
  BlogPostCover,
  BlogPostArticle,
} from "./ui/index";
