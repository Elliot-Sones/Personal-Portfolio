import { Bebas_Neue, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <div className={`${bebas.variable} ${jbmono.variable}`}>{children}</div>;
}
