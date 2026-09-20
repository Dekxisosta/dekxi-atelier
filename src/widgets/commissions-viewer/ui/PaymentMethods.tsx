import type { PaymentMethod } from "@entities/commission";

export default function PaymentMethods({ methods }: { methods: PaymentMethod[] }) {
  return (
    <div className="commission-block">
      <h3 className="commission-block-title">Modes of Payment</h3>
      <div className="commission-payment-methods">
        {methods.map((method) => (
          <div key={method.id} className="commission-payment-chip">
            <ion-icon name={method.icon} />
            <span>{method.label}</span>
            {method.note && <small>{method.note}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}
