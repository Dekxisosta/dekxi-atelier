export default function BlogPostCover({ src }: { src: string }) {
  return (
    <div className="blog-post-cover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" />
      <div className="blog-post-cover-fade"></div>
    </div>
  );
}