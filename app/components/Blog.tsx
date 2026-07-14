import "../blog/blog.css";
import type { BlogPost } from "../page";

function formatDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

export default function Blog({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="friends-main">
      <div className="friends-content">
        <div className="mutuals-header">
          <ion-icon name="reader-outline" className="mutuals-header-icon-ion"></ion-icon>
          <span className="mutuals-header-label">blog log!!</span>
          <div className="mutuals-header-line"></div>
        </div>

        <div className="blog-list" id="blogList">
          {posts.length === 0 && <p>No entries yet.</p>}
          {posts.map((post) => (
            <article className="blog-entry" key={post.id}>
              <div className="blog-entry-meta">
                <span className="blog-entry-date">{formatDate(post.published_at)}</span>
                <span className="blog-entry-tag">{post.tag}</span>
              </div>
              <h3 className="blog-entry-title">{post.title}</h3>
              <p className="blog-entry-excerpt">{post.excerpt}</p>
              <a className="blog-entry-link" href={`/blog/${post.slug}`}>
                read entry →
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}