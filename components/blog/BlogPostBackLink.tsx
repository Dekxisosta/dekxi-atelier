import Link from "next/link";

export default function BlogPostBackLink() {
  return (
    <Link href="/?tab=blog" className="blog-post-back">
      <ion-icon name="arrow-back-outline"></ion-icon>
      <span>back to blog log</span>
    </Link>
  );
}