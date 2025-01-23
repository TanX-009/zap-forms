import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@tanx-009/stxle-css";
import "../styles/variables.css";
import "../styles/globals.css";
import LoginRedirect from "./systems/LoginRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zap Forms",
  description: "Open-source Survey Forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}

        {/* systems */}
        <LoginRedirect />
      </body>
    </html>
  );
}
