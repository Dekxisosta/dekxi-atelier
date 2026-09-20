import type { PolicyItem } from "@entities/commission";

export default function DosDonts({ dos, donts }: { dos: PolicyItem[]; donts: PolicyItem[] }) {
  return (
    <div className="commission-panel">
      <h3 className="commission-block-title">Dos &amp; Don'ts</h3>
      <div className="commission-dos-donts">
        <ul className="commission-list commission-list-do">
          {dos.map((item) => (
            <li key={item.id}>
              <ion-icon name="checkmark-circle-outline" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <ul className="commission-list commission-list-dont">
          {donts.map((item) => (
            <li key={item.id}>
              <ion-icon name="close-circle-outline" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
