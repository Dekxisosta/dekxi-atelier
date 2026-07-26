import type { CommissionInfo } from "@/lib/types/commission";
import StatusBadge from "./StatusBadge";
import PricingTable from "./PricingTable";
import DosDonts from "./DosDonts";
import NsfwPolicy from "./NsfwPolicy";
import PaymentMethods from "./PaymentMethods";
import TermsOfService from "./TermsOfService";
import CommissionFaq from "./CommissionFaq";
import LinksSection from "./LinksSection";

export default function CommissionSheet({ info }: { info: CommissionInfo }) {
  return (
    <section className="commission-sheet">
      

      <div className="commission-layout">
        {/* 1/2 width — pricing + how to pay/contact */}
        <div className="commission-col-half">
          <header className="commission-header">
            <div className="commission-header-top">
              <div className="commission-title-group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img1.picmix.com/output/stamp/normal/1/6/4/3/2763461_c4a5d.png"
                  alt=""
                  className="commission-title-stamp"
                />
                <h1 className="commission-title">Commission Sheet</h1>
              </div>
              <StatusBadge status={info.status} />
            </div>
            <p className="commission-tagline">{info.tagline}</p>
          </header>
          <PricingTable table={info.pricingTable} />
          <PaymentMethods methods={info.paymentMethods} />

          <div className="commission-contact">
            <ion-icon name="mail-outline" />
            <span>{info.contactNote}</span>
          </div>

          <div className="commission-agreement">
            <ion-icon name="information-circle-outline" />
            <span>By commissioning, you agree to the Terms of Service and confirm you meet the required age.</span>
          </div>
        </div>

        {/* 1/4 width — what I will / won't draw */}
        <div className="commission-col-quarter">
          <LinksSection links={info.links} />
          <DosDonts dos={info.dos} donts={info.donts} />
          <NsfwPolicy items={info.nsfwPolicy} />
        </div>

        {/* 1/4 width — policy details */}
        <div className="commission-col-quarter">
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
    </section>
  );
}