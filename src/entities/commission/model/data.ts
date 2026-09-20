import type { CommissionInfo } from "./types";

export const COMMISSION_INFO: CommissionInfo = {
  status: "open",
  tagline: "Slots open in small batches — check the status badge before sending a request.",

  pricingTable: {
    stages: ["sketch", "lineart", "flats", "rendered"],
    rows: [
      { id: "chibi-bust",      type: "Chibi Bust",      prices: { sketch: "$3-5",   lineart: "$5-8",   flats: "$8-12",  rendered: "$12-18" } },
      { id: "anime-bust",      type: "Anime Bust",      prices: { sketch: "$5-8",   lineart: "$8-12",  flats: "$12-16", rendered: "$16-25" } },
      { id: "chibi-half-body", type: "Chibi Half Body", prices: { sketch: "$5-8",   lineart: "$8-12",  flats: "$12-18", rendered: "$18-28" } },
      { id: "anime-half-body", type: "Anime Half Body", prices: { sketch: "$8-12",  lineart: "$12-18", flats: "$18-25", rendered: "$25-40" } },
      { id: "chibi-full-body", type: "Chibi Full Body", prices: { sketch: "$8-12",  lineart: "$12-18", flats: "$16-22", rendered: "$22-35" } },
      { id: "anime-full-body", type: "Anime Full Body", prices: { sketch: "$10-15", lineart: "$15-22", flats: "$20-30", rendered: "$30-50" } },
    ],
    rushNote: "Rush (under 48 hours) +20-30%",
    turnaroundNote: "TAT: 1 week+",
  },

  dos: [
    { id: "d1", text: "OCs, fan characters, and self-inserts" },
    { id: "d2", text: "Detailed references (art, photos, written descriptions)" },
    { id: "d3", text: "Fanart of characters from games/anime" },
    { id: "d4", text: "Mild violence and battle-damage" },
  ],
  donts: [
    { id: "n1", text: "Real people / public figures" },
    { id: "n2", text: "Hate symbols or discriminatory content" },
    { id: "n3", text: "Anything underage in a sexual or suggestive context" },
    { id: "n4", text: "Extreme gore or fetish content" },
    { id: "n5", text: "Mecha, heavy machinery, or complex vehicles" },
  ],
  nsfwPolicy: [
    { id: "s1", text: "Available case-by-case for verified adult clients (18+) only." },
    { id: "s2", text: "Age verification may be requested before accepting a request." },
    { id: "s3", text: "Priced separately and quoted after reviewing the request." },
    { id: "s4", text: "Never posted publicly without explicit written consent." },
  ],
  paymentMethods: [
    { id: "gcash",  label: "GCash",  icon: "wallet-outline" },
    { id: "paypal", label: "PayPal", icon: "logo-paypal", note: "+ transaction fee" },
    { id: "ko-fi",  label: "Ko-fi",  icon: "cafe-outline" },
  ],
  terms: [
    { id: "t1", text: "50% deposit required before work begins; remainder due before final file delivery." },
    { id: "t2", text: "Turnaround is 1–3 weeks depending on queue and complexity." },
    { id: "t3", text: "Up to 2 minor revisions included at sketch stage; major changes after lineart may incur a fee." },
    { id: "t4", text: "Artist retains the right to post finished work in a portfolio unless a privacy add-on is purchased." },
    { id: "t5", text: "Commissions are for personal use only; commercial use requires a separate licensing agreement." },
    { id: "t6", text: "Refunds available only before sketch work has started; partial refunds may apply after." },
  ],
  turnaroundTime: "1–3 weeks, depending on queue length and piece complexity.",
  revisionPolicy:
    "2 minor revisions included at the sketch stage. Changes requested after lineart is approved may incur an added fee.",
  usageRights: "For personal, non-commercial use only unless a commercial license is purchased separately.",
  contactNote:
    "Send requests via DM with references attached — form links and Discord are on the Companions tab.",
  faq: [
    { id: "f1", question: "Can I ask for WIP updates?",   answer: "Yes — sketch and lineart stages are shared before final rendering." },
    { id: "f2", question: "Do you do traditional media?", answer: "No, all work is digital, done in Clip Studio Paint." },
  ],
  links: [
    { id: "vgen",      label: "VGen",      href: "https://vgen.co/dekxisosta" },
    { id: "kofi",      label: "Ko-fi",     href: "https://ko-fi.com/dekxisosta",                    iconUrl: "https://cdn.simpleicons.org/kofi/D2A14A" },
    { id: "instagram", label: "Instagram", href: "https://instagram.com/dekxisosta",                iconUrl: "https://cdn.simpleicons.org/instagram/D2A14A" },
    { id: "bluesky",   label: "Bluesky",   href: "https://bsky.app/profile/dekxisosta.bsky.social", iconUrl: "https://cdn.simpleicons.org/bluesky/D2A14A" },
    { id: "x",         label: "X",         href: "https://x.com/dekxisosta",                        iconUrl: "https://cdn.simpleicons.org/x/D2A14A" },
  ],
};
