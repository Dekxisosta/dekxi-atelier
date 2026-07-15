import { LATEST_BLOGS } from "@/lib/data/blog";

export default function BlogList() {
  return (
    <ul className="blog-list">
      {LATEST_BLOGS.map((post) => (
        <li key={post.title}>
          <a className="blog-list-link" href={post.href}>
            <span className="blog-list-title">{post.title}</span>
            <span className="blog-list-date">{post.date}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}