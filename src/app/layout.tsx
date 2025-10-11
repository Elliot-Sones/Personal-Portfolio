import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PitchBackground } from "@/components/PitchBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elliot's Portfolio",
  description:
    "Personal website for Elliot showcasing skills, work, projects, and ways to get in touch.",
    icons: {
      icon: "/icon.png",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebas.variable} antialiased bg-field text-foreground`}
      >
        <PitchBackground />
        {children}
        <AudioPlayer />
      </body>
    </html>
  );
}
