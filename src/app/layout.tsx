import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-jet",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "Molecular Dynamics Simulation Service | GROMACS, Desmond & AMBER — BioPC",
    template: "%s | BioPC MD Simulation Service",
  },
  description: SITE.description,
  keywords: [
    "molecular dynamics simulation service",
    "MD simulation service",
    "GROMACS simulation service",
    "Desmond molecular dynamics",
    "AMBER MD simulation",
    "MM/PBSA binding free energy",
    "MM/GBSA service",
    "protein ligand molecular dynamics",
    "free energy landscape analysis",
    "principal component analysis MD",
    "DCCM analysis",
    "RMSD RMSF analysis service",
    "publication ready MD figures",
    "molecular dynamics for thesis",
    "drug discovery simulation service",
    "vaccine construct MD simulation",
    "BioPC",
  ],
  authors: [{ name: "BioPC" }],
  creator: "BioPC",
  publisher: "BioPC",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title:
      "Turn your docking results into publication-ready molecular dynamics insights",
    description: SITE.description,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "BioPC Molecular Dynamics Simulation Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BioPC Molecular Dynamics Simulation Service",
    description: SITE.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.ico",
    apple: "/brand/apple-touch-icon.png",
  },
  category: "science",
};

export const viewport: Viewport = {
  themeColor: "#f6f9fd",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable} ${mono.variable} h-full`}
    >
      <head>
        {/* Opt into scroll-reveal only when JS is live, so the page is never
            left invisible if the bundle fails or IntersectionObserver stalls. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#0b1f3d] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
