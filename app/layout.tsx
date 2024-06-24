import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import cn from "classnames";
import { BASE_URL } from "@/utils/common";
import { TooltipProvider } from "@/components/tooltip";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const title = "Ray.so";
const description = "Ray.so";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: title,
  description: description,
  openGraph: {
    type: "website",
    siteName: "Ray.so",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@raycastapp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <TooltipProvider>
        <body className={cn("isolate", inter.className)}>{children}</body>
      </TooltipProvider>
      <Analytics />
    </html>
  );
}
