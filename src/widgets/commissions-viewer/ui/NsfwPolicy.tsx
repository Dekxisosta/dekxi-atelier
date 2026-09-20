import type { PolicyItem } from "@entities/commission";

export default function NsfwPolicy({ items }: { items: PolicyItem[] }) {
  return (
    <div className="commission-block commission-block-warning">
      <h3 className="commission-block-title">NSFW Content</h3>
      <ul className="commission-list">
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}
