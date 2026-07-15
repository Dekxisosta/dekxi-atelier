import BlogHeader from "@/components/blog/BlogHeader";
import BlogEntryCard from "@/components/blog/BlogEntryCard";
import type { BlogPost } from "@/lib/types/blog";

export default function Blog({ posts }: { posts: BlogPost[] }) {
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