import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PixelSoccerField } from "@/components/PixelSoccerField";
import { FilmOverlay } from "@/components/FilmOverlay";
import { RainOverlay } from "@/components/RainOverlay";
import { PixelDecorations } from "@/components/PixelDecorations";
import { ThemeProvider } from "@/components/ThemeContext";
import { PixelSun } from "@/components/PixelSun";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
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
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} antialiased bg-field text-foreground`}
      >
        <ThemeProvider>
          <Script src="https://unpkg.com/@rive-app/webgl@2" strategy="afterInteractive" />
          <PixelSoccerField />
          <FilmOverlay />
          <RainOverlay />
          <PixelDecorations />
          <PixelSun />
          {children}
          <AudioPlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}
