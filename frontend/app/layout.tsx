import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Asendia AI",
    template: "%s | Asendia AI",
  },
  description:
    "Transform placement assessment material into interactive coding practice sessions. Asendia AI converts PDFs, DOCX, and images into structured coding challenges.",
  keywords: ["placement preparation", "coding assessment", "AI", "EdTech", "technical interview"],
  robots: { index: false, follow: false }, // Not yet public-facing
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
