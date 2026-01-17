import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorFollower from "@/components/CursorFollower";
import SocialPopup from "@/components/SocialPopup";

export const metadata: Metadata = {
  title: "NexuJit - The Ultimate Digital Nexus",
  description: "Your all-in-one digital command center. Access elite tools for SEO, development, and productivity. 100% free, privacy-first, and designed for the next generation.",
  keywords: ["nexujit", "seo tools", "digital marketing", "developer tools", "productivity", "gen-z utilities"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-bg-primary text-fg-primary min-h-screen flex flex-col selection:bg-accent/30 selection:text-accent-foreground cursor-none">
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <CursorFollower />
        <Navbar />
        <main className="flex-1 w-full relative z-0">
          {children}
        </main>
        <Footer />
        <SocialPopup />
      </body>
    </html>
  );
}
