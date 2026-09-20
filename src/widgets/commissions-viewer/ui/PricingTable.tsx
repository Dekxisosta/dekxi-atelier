import type { PricingTable as PricingTableType } from "@entities/commission";
import { PRICE_STAGE_LABELS } from "@entities/commission";

export default function PricingTable({ table }: { table: PricingTableType }) {
  return (
    <div className="commission-block">
      <h3 className="commission-block-title">Rates</h3>
      <div className="commission-price-table-wrap">
        <table className="commission-price-table">
          <thead>
            <tr>
              <th className="commission-price-th-type">Type</th>
              {table.stages.map((stage) => (
                <th key={stage}>{PRICE_STAGE_LABELS[stage]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.id}>
                <td className="commission-price-td-type">{row.type}</td>
                {table.stages.map((stage) => (
                  <td key={stage}>{row.prices[stage] ?? "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(table.rushNote || table.turnaroundNote) && (
        <div className="commission-price-footnote">
          {table.rushNote      && <span>{table.rushNote}</span>}
          {table.turnaroundNote && <span>{table.turnaroundNote}</span>}
        </div>
      )}
    </div>
  );
}
