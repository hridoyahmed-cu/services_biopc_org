import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
import Services from "@/components/sections/Services";
import Deliverables from "@/components/sections/Deliverables";
import Workflow from "@/components/sections/Workflow";
import Packages from "@/components/sections/Packages";
import Gallery from "@/components/sections/Gallery";
import ResearchAreas from "@/components/sections/ResearchAreas";
import Credibility from "@/components/sections/Credibility";
import Faq from "@/components/sections/Faq";
import Quotation from "@/components/sections/Quotation";
import SectionDivider from "@/components/SectionDivider";
import { FAQ, PACKAGES, SERVICES, SITE } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE.url}/#service`,
      name: SITE.name,
      alternateName: "BioPC MD Simulation Service",
      url: SITE.url,
      description: SITE.description,
      slogan: SITE.tagline,
      telephone: SITE.phone,
      email: SITE.email,
      sameAs: [SITE.facebook],
      areaServed: "Worldwide",
      knowsAbout: [
        "Molecular dynamics simulation",
        "GROMACS",
        "Desmond",
        "AMBER",
        "MM/PBSA",
        "MM/GBSA",
        "Principal component analysis",
        "Free energy landscape",
        "Dynamic cross-correlation matrix",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Molecular dynamics simulation services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.summary,
          },
        })),
      },
      makesOffer: PACKAGES.map((p) => ({
        "@type": "Offer",
        name: `${p.length} production MD simulation`,
        description: `${p.bestFor} — ${p.output}. ${p.note}`,
        category: "Molecular dynamics simulation",
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "en",
      publisher: { "@id": `${SITE.url}/#service` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <SectionDivider />
      <WhyUs />
      <SectionDivider />
      <Services />
      <SectionDivider flip />
      <Deliverables />
      <SectionDivider />
      <Workflow />
      <SectionDivider flip />
      <Packages />
      <SectionDivider />
      <Gallery />
      <SectionDivider flip />
      <ResearchAreas />
      <SectionDivider />
      <Credibility />
      <SectionDivider flip />
      <Faq />
      <SectionDivider />
      <Quotation />
    </>
  );
}
