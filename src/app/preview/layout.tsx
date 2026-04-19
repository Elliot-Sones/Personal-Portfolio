import { Bricolage_Grotesque, Fraunces, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${fraunces.variable} ${jbmono.variable}`}>
      {children}
    </div>
  );
}
