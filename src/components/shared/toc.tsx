'use client';
import { useEffect, useState } from 'react';

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const sections: string[] = [
      'customs-clearance',
      'unacceptable-shipments',
      'deliveries-and-undeliverables',
      'inspection',
      'shipment-charges',
      'liability',
      'claims',
      'shipment-insurance',
      'circumstances',
      'representations',
      'routing',
      'governing-law',
      'severability',
    ];

    const handleScroll = () => {
      let currentSection = '';
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust the condition to better capture the sections at the bottom
          if (rect.top <= window.innerHeight * 0.2 && rect.bottom >= 50) {
            currentSection = section;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const tocItems = [
    {
      id: 'customs-clearance',
      label: 'Customs Clearance and Regulatory Compliance',
    },
    { id: 'unacceptable-shipments', label: 'Unacceptable Shipments' },
    {
      id: 'deliveries-and-undeliverables',
      label: 'Deliveries and Undeliverables',
    },
    { id: 'inspection', label: 'Inspection' },
    { id: 'shipment-charges', label: 'Shipment Charges, Duties and Fees' },
    { id: 'liability', label: 'BIZNA TOP’s Liability' },
    { id: 'claims', label: 'Claims' },
    { id: 'shipment-insurance', label: 'Shipment Insurance' },
    { id: 'circumstances', label: 'Circumstances Beyond BIZNA TOP’s Control' },
    {
      id: 'representations',
      label: 'Shipper’s Representations, Warranties and Indemnities',
    },
    { id: 'routing', label: 'Routing' },
    { id: 'governing-law', label: 'Governing Law' },
    { id: 'severability', label: 'Severability' },
  ];

  return (
    <nav className="hidden text-sm md:col-span-1 xl:block">
      <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-8">
        <h2 className="mb-4 text-lg font-semibold">Table of Contents</h2>
        <ul className="list-inside list-decimal space-y-2">
          {tocItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${
                  activeSection === item.id ? 'font-medium text-primary' : ''
                } text-muted-foreground hover:underline`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
