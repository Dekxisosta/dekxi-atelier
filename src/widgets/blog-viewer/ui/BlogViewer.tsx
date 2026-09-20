import { BlogEntryCard } from "@entities/blog-post";
import type { BlogPost } from "@entities/blog-post";
import BlogHeader from "./BlogHeader";

export default function BlogViewer({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="friends-main">
      <div className="friends-content">
        <BlogHeader />
        <div className="blog-list blog-list-grid" id="blogList">
          {posts.length === 0 && <p>No entries yet.</p>}
          {posts.map((post) => (
            <BlogEntryCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
