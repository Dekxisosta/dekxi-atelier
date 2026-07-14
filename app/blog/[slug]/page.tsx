import { notFound } from "next/navigation";
import IdeHeader from "@/components/IdeHeader";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) notFound();

  return (
    <div className="container-page">
      <div className="bg-decor"></div>
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <IdeHeader />

          <div className="friends-main">
            <div className="friends-content">
              <article className="blog-entry">
                <div className="blog-entry-meta">
                  <span className="blog-entry-date">{post.tag}</span>
                </div>
                <h1 className="blog-entry-title">{post.title}</h1>
                <p className="blog-entry-excerpt">{post.excerpt}</p>
                <div className="blog-entry-content">{post.content}</div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
