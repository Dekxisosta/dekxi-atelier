import type { PolicyItem } from "@entities/commission";

export default function NsfwPolicy({ items }: { items: PolicyItem[] }) {
  return (
    <div className="commission-panel commission-panel--warning">
      <h3 className="commission-block-title commission-block-title--nsfw">
        <ion-icon name="lock-closed-outline" />
        NSFW — 18+
      </h3>
      <ul className="commission-list">
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}
