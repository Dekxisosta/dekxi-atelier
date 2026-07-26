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

// Full shape passed down from the server as a single HomeClient prop.
export type CommissionInfo = {
  status: CommissionStatus;
  tagline: string;
  pricingTable: PricingTable; // was: tiers: PricingTier[]
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
};

export type PriceStage = "sketch" | "lineart" | "flats" | "rendered";
export type PriceRow = {
  id: string;
  type: string; // e.g. "Chibi Bust", "Anime Full Body"
  prices: Partial<Record<PriceStage, string>>; // e.g. { sketch: "$3-5", rendered: "$12-18" }
};

export type PricingTable = {
  stages: PriceStage[];
  rows: PriceRow[];
  rushNote?: string
  turnaroundNote?: string;
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