import type { PolicyItem } from "@/lib/types/commission";

export default function TermsOfService({ terms }: { terms: PolicyItem[] }) {
  return (
    <div className="commission-block">
      <h3 className="commission-block-title">Terms of Service</h3>
      <ol className="commission-terms-list">
        {terms.map((term) => (
          <li key={term.id}>{term.text}</li>
        ))}
      </ol>
    </div>
  );
}