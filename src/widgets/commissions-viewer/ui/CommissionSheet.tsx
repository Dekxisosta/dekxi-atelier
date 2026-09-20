import type { CommissionInfo } from "@entities/commission";
import { PROFILE_LINKS, PROFILE_FRAME } from "@entities/profile";
import PricingTable from "./PricingTable";
import DosDonts from "./DosDonts";
import NsfwPolicy from "./NsfwPolicy";
import CommissionSamples from "./CommissionSamples";
import PaymentMethods from "./PaymentMethods";
import TermsOfService from "./TermsOfService";
import CommissionFaq from "./CommissionFaq";

const HEADER_LINK_LABELS = new Set(["Bluesky", "Twitter", "FB", "IG", "VGen", "Discord"]);

export default function CommissionSheet({ info }: { info: CommissionInfo }) {
  const headerLinks = PROFILE_LINKS.filter((l) => HEADER_LINK_LABELS.has(l.label));

  return (
    <div className="container-main commission-container">

      {/* ── LEFT — header + pricing + payment + CTA ── */}
      <div className="main-left">
        <div className="main-left-content commission-left-content">

          <header className="commission-header">
            <div className="commission-header-top">
              <div className="commission-title-group">
                <div className="commission-stamp-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img1.picmix.com/output/stamp/normal/1/6/4/3/2763461_c4a5d.png"
                    alt=""
                    className="commission-title-stamp"
                  />
                </div>
                <h1 className="commission-title">Commission Sheet</h1>
              </div>
              <div className="commission-header-links">
                {headerLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="commission-header-link"
                    title={link.label}
                  >
                    <span className="commission-header-link-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={link.icon}
                        alt={link.label}
                        className="commission-header-link-icon"
                        style={link.invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
                      />
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PROFILE_FRAME}
                      alt=""
                      className="commission-header-link-frame"
                    />
                  </a>
                ))}
              </div>
            </div>
            <p className="commission-tagline">{info.tagline}</p>
          </header>

          <PricingTable table={info.pricingTable} />
          <PaymentMethods methods={info.paymentMethods} />

          <div className="commission-contact">
            <ion-icon name="mail-outline" />
            <span>{info.contactNote}</span>
          </div>

          <a href="?tab=gallery" className="commission-gallery-link">
            <ion-icon name="images-outline" />
            <span>View my art gallery</span>
            <span className="commission-gallery-link-arrow">
              <ion-icon name="arrow-forward-outline" />
            </span>
          </a>

          <div className="commission-agreement">
            <ion-icon name="information-circle-outline" />
            <span>
              By commissioning, you agree to the Terms of Service and confirm you meet the
              required age.
            </span>
          </div>

        </div>
      </div>

      {/* ── CENTER — samples + dos/donts + NSFW ── */}
      <div className="main-center commission-center">
        <CommissionSamples samples={info.samples ?? []} />
        <DosDonts dos={info.dos} donts={info.donts} />
        <NsfwPolicy items={info.nsfwPolicy} />
      </div>

      {/* ── RIGHT — policy blocks + ToS + FAQ ── */}
      <div className="main-right commission-right">
        <div className="commission-block">
          <h3 className="commission-block-title">Turnaround &amp; Revisions</h3>
          <p className="commission-note">{info.turnaroundTime}</p>
          <p className="commission-note">{info.revisionPolicy}</p>
        </div>
        <div className="commission-block">
          <h3 className="commission-block-title">Usage Rights</h3>
          <p className="commission-note">{info.usageRights}</p>
        </div>
        <TermsOfService terms={info.terms} />
        {info.faq && info.faq.length > 0 && <CommissionFaq faq={info.faq} />}
      </div>

    </div>
  );
}
