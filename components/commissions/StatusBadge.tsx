import type { CommissionStatus } from "@/lib/types/commission";

const STATUS_LABEL: Record<CommissionStatus, string> = {
  open: "Slots Open",
  closed: "Closed",
  waitlist: "Waitlist Only",
};

export default function StatusBadge({ status }: { status: CommissionStatus }) {
  return (
    <span className={`commission-status commission-status-${status}`}>
      <span className="commission-status-dot" />
      {STATUS_LABEL[status]}
    </span>
  );
}