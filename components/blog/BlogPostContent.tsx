import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPostContent({ content }: { content: string }) {
  return (
    <div className="blog-post-content">
      <div className="md-preview-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}