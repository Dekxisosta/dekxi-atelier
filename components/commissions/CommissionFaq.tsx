export default function CommissionFaq({ faq }: { faq: { id: string; question: string; answer: string }[] }) {
  return (
    <div className="commission-block">
      <h3 className="commission-block-title">FAQ</h3>
      <div className="commission-faq">
        {faq.map((item) => (
          <details key={item.id} className="commission-faq-item">
            <summary>{item.question}</summary>
            <p className="commission-faq-a">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}