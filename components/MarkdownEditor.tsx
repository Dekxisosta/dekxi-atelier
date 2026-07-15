"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownEditor({
  value,
  onChange,
  textareaRef
}: {
  value: string;
  onChange: (v: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}) {
  return (
    <div className="md-editor">
      <div className="md-editor-pane md-editor-source">
        <div className="md-editor-pane-label">source.md</div>
        <textarea
          ref={textareaRef}
          className="md-editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your post in Markdown..."
        />
      </div>
      <div className="md-editor-pane md-editor-preview">
        <div className="md-editor-pane-label">preview</div>
        <div className="md-preview-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || "*Nothing to preview yet.*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}