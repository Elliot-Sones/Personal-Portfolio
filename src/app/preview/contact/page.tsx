"use client";

import { Nav, PageHead, PageFooter } from "../_components/Nav";
import { SocialIcon } from "../_components/SocialIcon";
import { socials } from "../_lib/data";

export default function ContactPage() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,234,213,1) 0, rgba(244,234,213,1) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 pt-32 sm:pt-36 pb-16">
        <PageHead
          number="05"
          label="Contact"
          title="Reach out."
          tagline="I read everything — the fastest way to hear back is email."
        />

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-10">
          <div>
            <div className="grid grid-cols-2 gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group relative flex items-center gap-3 p-4 rounded-md border border-[#f4ead5]/10 bg-[#0a1410]/50 backdrop-blur-md hover:border-[#00e87b]/45 hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  {/* corner brackets */}
                  <span className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#f4ead5]/25 group-hover:border-[#00e87b] transition" />
                  <span className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#f4ead5]/25 group-hover:border-[#00e87b] transition" />
                  <span className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#f4ead5]/25 group-hover:border-[#00e87b] transition" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#f4ead5]/25 group-hover:border-[#00e87b] transition" />

                  <SocialIcon name={s.label} className="w-5 h-5 text-white/70 group-hover:text-[#00e87b] transition" />
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-[family-name:var(--font-bricolage)] text-lg tracking-[-0.005em] text-[#f4ead5] group-hover:text-[#00e87b] transition"
                      style={{ fontVariationSettings: '"wdth" 88, "wght" 600' }}
                    >
                      {s.label}
                    </div>
                  </div>
                  <span className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-white/40 group-hover:text-[#00e87b] transition">
                    →
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-md border border-[#00e87b]/25 bg-[#00e87b]/[0.04]">
              <div className="flex items-center gap-2 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#00e87b] mb-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#00e87b] opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00e87b]" />
                </span>
                Open to opportunities
              </div>
              <p className="text-sm text-[#f4ead5]/70 leading-relaxed">
                Full-time from May 2026. Internships, collaborations, RL / ML / transformers research, or just a chat — reach out.
              </p>
            </div>
          </div>

          <form
            action="https://formsubmit.co/soneselliot@gmail.com"
            method="POST"
            className="relative p-6 rounded-md bg-[#0a1410]/60 backdrop-blur-md border border-[#f4ead5]/10 h-fit"
          >
            <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#00e87b]/60" />
            <span className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#00e87b]/60" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#00e87b]/60" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#00e87b]/60" />

            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#f4ead5]/10">
              <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#00e87b]">
                ● Direct channel
              </div>
              <div className="font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.2em] uppercase text-white/40">
                Encrypted · FormSubmit
              </div>
            </div>

            <input type="hidden" name="_subject" value="New message from your portfolio!" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <div className="mb-4">
              <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="w-full px-3 py-2.5 rounded-sm bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition"
              />
            </div>
            <div className="mb-4">
              <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 rounded-sm bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition"
              />
            </div>
            <div className="mb-5">
              <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Any details?</label>
              <textarea
                name="message"
                placeholder="Tell me what you're working on."
                rows={5}
                required
                className="w-full px-3 py-2.5 rounded-sm bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-sm bg-[#00e87b] text-[#0a1410] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
            >
              Transmit Message →
            </button>
          </form>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
