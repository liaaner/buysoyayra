import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const runtime = 'edge';

export const metadata: Metadata = {
  title: {
    template: "%s | Buy Soyara",
    default: "Buy Soyara - Premium E-Commerce",
  },
  description: "A premium modern e-commerce storefront offering high-quality products.",
  icons: {
    icon: '/icon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://buysoyara.shop"),
  openGraph: {
    title: "Buy Soyara - Premium E-Commerce",
    description: "A premium modern e-commerce storefront offering high-quality products.",
    url: "/",
    siteName: "Buy Soyara",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Soyara - Premium E-Commerce",
    description: "A premium modern e-commerce storefront offering high-quality products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
