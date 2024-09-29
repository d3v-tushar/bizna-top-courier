import { TableOfContents } from '@/components/shared/toc';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="mt-6 flex h-full w-full flex-col items-center justify-center p-4">
      <div className="container grid gap-8 md:grid-cols-4">
        <div className="col-span-full space-y-2">
          <h1 className="col-span-full text-4xl font-bold">
            Terms and Conditions of Carriage
          </h1>
          <p className="col-span-full">Last updated: 28th September 2024</p>
        </div>
        <div className="space-y-8 md:col-span-3">
          <section
            id="important-notice"
            className="scroll-mt-16 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">Important Notice</h2>
            <p className="text-muted-foreground">
              When utilizing BIZNA TOP&apos;s services, you, as
              &quot;Shipper,&quot; are agreeing, on your behalf and on behalf of
              the recipient of the Shipment (&quot;Recipient&quot;) and anyone
              else with an interest in the Shipment that these Terms and
              Conditions shall apply.
            </p>
          </section>

          <section id="customs-clearance" className="scroll-mt-16 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              1. Customs Clearance and Regulatory Compliance
            </h2>
            <p className="text-muted-foreground">
              BIZNA TOP may perform any of the following activities on
              Shipper&apos;s or Consignee&apos;s behalf in order to provide its
              services: (1) complete any documents, amend product or service
              codes, and pay any duties, taxes or penalties required under
              applicable laws and regulations, (2) act as Shipper&apos;s
              forwarding agent for customs and export control purposes and as
              Consignee solely for the purpose of designating a customs broker
              to perform customs clearance and entry and (3) redirect the
              Shipment to Consignee&apos;s import broker or other address upon
              request by any person who BIZNA TOP believes in its reasonable
              opinion to be authorized.
            </p>
          </section>

          <section
            id="unacceptable-shipments"
            className="scroll-mt-16 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              2. Unacceptable Shipments
            </h2>
            <p className="text-muted-foreground">
              A Shipment is deemed unacceptable if:
            </p>
            <ul className="mt-2 list-inside list-disc text-muted-foreground">
              <li>
                It contains counterfeit goods, animals, bullion, currency, gem
                stones; weapons, explosives and ammunition; human remains;
                illegal items, such as narcotics and other illicit drugs
              </li>
              <li>
                It is classified as hazardous material, dangerous goods,
                prohibited or restricted articles by IATA, ICAO, or any relevant
                government department or other relevant organization
              </li>
              <li>
                It contains any other item which BIZNA TOP decides cannot be
                carried safely or legally
              </li>
            </ul>
          </section>

          <section
            id="deliveries-and-undeliverables"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              3. Deliveries and Undeliverables
            </h2>
            <p className="text-muted-foreground">
              Shipments cannot be delivered to PO boxes or postal codes.
              Shipments are delivered to the Consignee&apos;s address given by
              Shipper but not necessarily to the named Consignee personally.
              Shipments to addresses with a central receiving area will be
              delivered to that area.
            </p>
            <p className="text-muted-foreground">
              BIZNA TOP may notify Consignee of an upcoming delivery or a missed
              delivery. Consignee may be offered alternative delivery options
              such as delivery on another day, no signature required,
              redirection or collection at a BIZNA TOP Service Point.
            </p>

            <p className="text-muted-foreground">
              If the Shipment is deemed to be unacceptable as described in
              Section 2, it has been undervalued for customs purposes, Consignee
              cannot be reasonably identified or located, or Consignee refuses
              delivery or to pay Customs Duties or other Shipment charges, DHL
              shall use reasonable efforts to return the Shipment to Shipper.
              This shall be at Shipper’s cost. If it is not possible to return
              the Shipment, it may be released, abandoned, disposed of or sold
              without incurring any liability whatsoever to Shipper or anyone
              else. BIZNA TOP shall have the right to destroy any Shipment if
              BIZNA TOP is prevented by any law or law enforcement agency from
              returning it in whole or in part to Shipper, as well as any
              Shipment of Dangerous Goods.
            </p>
          </section>

          <section id="inspection" className="scroll-mt-16 rounded-lg p-6">
            <h2 className="mb-4 text-2xl font-semibold">4. Inspection</h2>
            <p className="text-muted-foreground">
              BIZNA TOP has the right to open and inspect a Shipment without
              notice for safety, security, customs or other regulatory reasons.
            </p>
          </section>

          <section
            id="shipment-charges"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              5. Shipment Charges, Duties and Fees
            </h2>
            <p className="text-muted-foreground">
              BIZNA TOP&apos;s Charges are calculated according to the higher of
              actual or volumetric weight per piece and any piece may be
              re-weighed and re-measured by BIZNA TOP to confirm this
              calculation.
            </p>

            <p className="text-muted-foreground">
              Payment of Customs Duties and other charges due as indicated on
              BIZNA TOP’s website in the receiving country may be requested from
              Consignee prior to delivery. This includes a fee if BIZNA TOP uses
              its credit with the Customs Authorities or pays any Customs Duties
              on Consignee’s behalf. Shipper shall pay or reimburse BIZNA TOP
              for all Customs Duties and other charges due for services provided
              by BIZNA TOP or incurred by BIZNA TOP on Shipper’s or Consignee’s
              behalf if Consignee has failed to pay
            </p>
          </section>

          <section
            id="liability"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              6. BIZNA TOP’s Liability
            </h2>
            <ol className="flex list-inside list-decimal flex-col space-y-4">
              <li className="text-muted-foreground">
                BIZNA TOP’s liability in respect of any one Shipment transported
                by air (including ancillary road transport or stops en route) is
                limited by the Montreal Convention or the Warsaw Convention as
                applicable, or in the absence of such Convention, to the lower
                of the current market.
                <br />
                <br />
                If Shipper regards these limits as insufficient it must make a
                special declaration of value and request insurance as described
                in Section 8 or make its own insurance arrangements
                <br />
                <br />
                BIZNA TOP’s liability is strictly limited to direct loss and
                damage to a Shipment only and to the per kilogram limits in this
                Section 6. All other types of loss or damage are excluded
                (including but not limited to lost profits, income, interest,
                future business), whether such loss or damage is special or
                indirect, and even if the risk of such loss or damage was
                brought to BIZNA TOP’s attention.
              </li>

              <li className="text-muted-foreground">
                BIZNA TOP will make every reasonable effort to deliver the
                Shipment according to BIZNA TOP’s regular delivery schedules,
                but these schedules are not binding and do not form part of the
                contract. BIZNA TOP is not liable for any damages or loss caused
                by delay
              </li>
            </ol>
          </section>

          <section
            id="claims"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">7. Claims</h2>
            <p className="text-muted-foreground">
              All claims must be submitted in writing to BIZNA TOP within 48
              hours of Receiving Products, failing which BIZNA TOP shall have no
              liability whatsoever. Claims are limited to one claim per
              Shipment, settlement of which will be full and final settlement
              for all loss or damage in connection therewith
            </p>
          </section>

          <section
            id="shipment-insurance"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              8. Shipment Insurance
            </h2>
            <p className="text-muted-foreground">
              BIZNA TOP may be able to arrange insurance for loss of or damage
              to the Shipment, covering the full value of the goods, provided
              that Shipper so instructs BIZNA TOP in writing, including by
              completing the insurance section of the waybill or using BIZNA
              TOP’s automated systems and pays the applicable premium. Shipment
              insurance does not cover indirect loss or damage, or loss or
              damage caused by delays
            </p>
          </section>

          <section
            id="circumstances"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              9. Circumstances Beyond BIZNA TOP’s Contro
            </h2>
            <p className="text-muted-foreground">
              BIZNA TOP is not liable for any loss or damage arising out of
              circumstances beyond BIZNA TOP’s control. These include but are
              not limited to electrical or magnetic damage to, or erasure of,
              electronic or photographic images, data or recordings; any defect
              or characteristic related to the nature of the Shipment, even if
              known to BIZNA TOP; any act or omission by a person not employed
              or contracted by BIZNA TOP - e.g. Shipper, Consignee, third party,
              customs or other government official; third party cyber- attacks
              or other information security related threats; “Force Majeure” -
              e.g. earthquake, cyclone, storm, flood, fog, war, plane crash,
              embargo, riot, epidemic, pandemic, civil commotion, or industrial
              action.
            </p>
          </section>

          <section
            id="representations"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              10. Shipper’s Representations, Warranties and Indemnities
            </h2>
            <p className="text-muted-foreground">
              Shipper shall indemnify and hold BIZNA TOP and its directors,
              officers, employees and agents harmless from and against all and
              any liabilities, losses and damages arising out of Shipper’s
              failure to comply with the following warranties and
              representations:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                the Shipment is acceptable for transport under Section 2 above,
              </li>
              <li>
                the Shipment was prepared in secure premises by reliable persons
                and was protected against unauthorized interference during
                preparation, storage and any transportation to
              </li>
              <li>
                Shipper has complied with applicable export control, sanctions,
                customs laws and regulations or other applicable regulatory
                requirements and restrictions related to the import, export,
                transit or transfer of goods
              </li>
              <li>
                Shipper has declared to BIZNA TOP any controlled dual-use or
                military goods subject to government authorizations contained in
                the Shipment,
              </li>
              <li>
                Shipper has provided all information, permits, licenses or other
                government authorizations and documents, as required by
                applicable law or upon request from BIZNA TOP, and all
                information, permits, licenses or other government
                authorizations and documents provided by Shipper or its
                representatives are true, complete and accurate, including the
                value and description of the goods and Shipper and Consignee
                information,
              </li>
              <li>
                when providing personal data to BIZNA TOP, Shipper has complied
                with its legal obligations to process and share this data,
                including informing the affected individuals that personal data,
                including Consignee’s email address and mobile phone number, is
                required for transport, customs clearance and delivery.
              </li>
            </ul>
          </section>

          <section
            id="routing"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">11. Routing</h2>
            <p className="text-muted-foreground">
              Shipper agrees to all routing and diversion, including the
              possibility that the Shipment may be carried via intermediate
              stopping places
            </p>
          </section>

          <section
            id="governing-law"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">12. Governing Law</h2>
            <p className="text-muted-foreground">
              Any dispute arising under or in any way connected with these Terms
              and Conditions shall be subject to the non-exclusive jurisdiction
              of the courts of, and governed by the law of the country of origin
              of the Shipment and Shipper irrevocably submits to such
              jurisdiction, unless contrary to applicable law.
            </p>
          </section>

          <section
            id="severability"
            className="scroll-mt-16 space-y-4 rounded-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-semibold">13. Severability</h2>
            <p className="text-muted-foreground">
              The invalidity or unenforceability of any provision shall not
              affect any other part of these Terms and Conditions.
            </p>
          </section>

          <section className="mt-24">
            <p className="mb-4 mt-auto text-muted-foreground">
              By using our services, you acknowledge that you have read and
              understood these Terms and Conditions and agree to be bound by
              them.
            </p>
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </section>
        </div>

        <TableOfContents />
      </div>
    </div>
  );
}
