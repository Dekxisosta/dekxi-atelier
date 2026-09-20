export type CommissionStatus = "open" | "closed" | "waitlist";

export type PricingTier = {
  id: string;
  label: string;
  price: string;
  description?: string;
  addons?: string[];
};

export type PaymentMethod = {
  id: string;
  label: string;
  icon: string; // ionicon name
  note?: string;
};

export type PolicyItem = {
  id: string;
  text: string;
};

export type PriceStage = "sketch" | "lineart" | "flats" | "rendered";

export type PriceRow = {
  id: string;
  type: string;
  prices: Partial<Record<PriceStage, string>>;
};

export type PricingTable = {
  stages: PriceStage[];
  rows: PriceRow[];
  rushNote?: string;
  turnaroundNote?: string;
  discountPercent?: number;
};

export const PRICE_STAGE_LABELS: Record<PriceStage, string> = {
  sketch: "Sketch",
  lineart: "Lineart",
  flats: "Flats",
  rendered: "Rendered",
};

export type CommissionLink = {
  id: string;
  label: string;
  href: string;
  iconUrl?: string;
  badgeText?: string;
};

export type CommissionSample = {
  id: string;
  /** Path relative to /public, e.g. "/assets/samples/chibi-bust-01.jpg" */
  src: string;
  alt: string;
  /** Optional label shown on hover, e.g. "Chibi Bust · Rendered" */
  caption?: string;
};

export type CommissionInfo = {
  status: CommissionStatus;
  tagline: string;
  pricingTable: PricingTable;
  dos: PolicyItem[];
  donts: PolicyItem[];
  nsfwPolicy: PolicyItem[];
  paymentMethods: PaymentMethod[];
  terms: PolicyItem[];
  turnaroundTime: string;
  revisionPolicy: string;
  usageRights: string;
  contactNote: string;
  faq?: { id: string; question: string; answer: string }[];
  links: CommissionLink[];
  samples?: CommissionSample[];
};
