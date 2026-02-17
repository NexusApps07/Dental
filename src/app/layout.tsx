import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
// Import the branding helper we just created
import DynamicBranding from "@/components/DynamicBranding";

// --- FONT CONFIGURATION ---
const sans = Outfit({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  display: 'swap',
});

const serif = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-serif',
  display: 'swap',
});

// --- DEPLOYMENT CONSTANTS (UPDATED FOR AUTOMATION) ---
// CRITICAL FIX: We now look for the environment variable injected by GitHub Actions first.
// If that is missing (local dev), we fall back to an empty string.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const APP_NAME = "Premium Client Portal"; 
const THEME_COLOR = process.env.NEXT_PUBLIC_THEME_COLOR || "#38bdf8";

// --- METADATA & PWA BRAIN ---
export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Premium Client Portal - Official App",
  // These now use the dynamic BASE_PATH so icons work on every new repo
  manifest: `${BASE_PATH}/manifest.json`, 
  icons: {
    icon: `${BASE_PATH}/favicon.ico`,
    apple: `${BASE_PATH}/icon-192x192.png`, 
  },
};

// --- VIEWPORT CONFIGURATION ---
export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming to maintain "Native App" feel
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black overscroll-none scroll-smooth">
      <body 
        className={`
          ${sans.variable} 
          ${serif.variable} 
          font-sans 
          antialiased 
          text-neutral-200 
          selection:bg-nexusBlue/30 
          min-h-screen
          bg-[#050505]
        `}
      >
        {/* This component runs silently on load. 
           It looks at the URL (e.g. /west-ashley-paws) and updates the 
           browser tab title automatically. 
        */}
        <DynamicBranding />

        {/* Persistent background gradient for the luxury aesthetic */}
        <div className="fixed inset-0 bg-gradient-to-b from-black via-slate-950 to-black pointer-events-none -z-50" />
        
        {children}
      </body>
    </html>
  );
}
