import type { PricingTable as PricingTableType, PriceStage } from "@entities/commission";
import { PRICE_STAGE_LABELS } from "@entities/commission";

const STAGE_ICONS: Record<PriceStage, string> = {
  sketch:   "pencil-outline",
  lineart:  "create-outline",
  flats:    "color-palette-outline",
  rendered: "sparkles-outline",
};

/**
 * Parses a price string like "$8-12" or "$30-50" into [low, high] numbers.
 * Returns null if the string doesn't match the expected format.
 */
function parsePriceRange(price: string): [number, number] | null {
  const match = price.match(/^\$(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2])];
}

/**
 * Applies a discount percentage to a price string.
 * "$8-12" at 25% off → "$6-9"
 */
function applyDiscount(price: string, discountPercent: number): string {
  const range = parsePriceRange(price);
  if (!range) return price;
  const factor = 1 - discountPercent / 100;
  const low  = Math.round(range[0] * factor);
  const high = Math.round(range[1] * factor);
  return `$${low}-${high}`;
}

export default function PricingTable({ table }: { table: PricingTableType }) {
  const lastStage = table.stages[table.stages.length - 1];
  const discount  = table.discountPercent;

  return (
    <div className="commission-block">
      <h3 className="commission-block-title">
        Rates
        {discount && (
          <span className="commission-discount-badge">
            <ion-icon name="pricetag-outline" />
            {discount}% OFF
          </span>
        )}
        {table.rushNote && (
          <span className="commission-price-footnote-badge">
            <ion-icon name="flash-outline" />
            {table.rushNote}
          </span>
        )}
        {table.turnaroundNote && (
          <span className="commission-price-footnote-badge">
            <ion-icon name="time-outline" />
            {table.turnaroundNote}
          </span>
        )}
      </h3>
      <div className="commission-price-table-wrap">
        <table className="commission-price-table">
          <thead>
            <tr>
              <th className="commission-price-th-type">Type</th>
              {table.stages.map((stage) => (
                <th
                  key={stage}
                  className={stage === lastStage ? "commission-price-th-premium" : ""}
                >
                  <span className="commission-price-th-inner">
                    <ion-icon name={STAGE_ICONS[stage]} />
                    {PRICE_STAGE_LABELS[stage]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 1 ? "commission-price-row-alt" : ""}>
                <td className="commission-price-td-type">{row.type}</td>
                {table.stages.map((stage) => {
                  const original = row.prices[stage] ?? "—";
                  const discounted = discount ? applyDiscount(original, discount) : null;
                  return (
                    <td
                      key={stage}
                      className={stage === lastStage ? "commission-price-td-premium" : ""}
                    >
                      {discounted && discounted !== original ? (
                        <span className="commission-price-cell">
                          <span className="commission-price-original">{original}</span>
                          <span className="commission-price-discounted">{discounted}</span>
                        </span>
                      ) : (
                        original
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
