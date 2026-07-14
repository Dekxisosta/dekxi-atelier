import IdeHeader from "@/components/IdeHeader";
import UnderConstruction from "@/components/UnderConstruction";
import { createClient } from "@/lib/supabase/server";
import "./blog.css";
export const dynamic = "force-dynamic";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  published_at: string;
};

async function getPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load blog posts from Supabase:", error.message);
    return [];
  }
  return data || [];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container-page">
      <div className="bg-decor"></div>
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <IdeHeader />

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
                      <span className="blog-entry-date">
                        {formatDate(post.published_at)}
                      </span>
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
        </div>
      </div>
    </div>
  );
}
