import type { Metadata } from "next";
import {
  Fraunces,
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Syne,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elliotsones.com"),
  title: "Elliot Sones · AI Engineer",
  description:
    "Computer Science student at TMU building intelligent agents and deep learning systems. Reinforcement learning, transformer architectures, applied AI.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Elliot Sones · AI Engineer",
    description:
      "Building intelligent agents — and the infra that lets them play.",
    images: ["/icon.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${fraunces.variable} ${jbMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
