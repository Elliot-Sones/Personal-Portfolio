"use client";

import { Nav, PageHead, PageFooter } from "../_components/Nav";
import { socials } from "../_lib/data";

export default function ContactPage() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        <PageHead number="06" label="Contact" title="Reach out." tagline="Feel free to reach out or discuss what you are working on." />

        <div className="grid md:grid-cols-[1fr_1fr] gap-10">
          <div>
            <p className="text-lg leading-relaxed text-white/75 mb-8">
              I read everything. The fastest way to hear back is email, but any of the below works.
            </p>
            <div className="flex flex-col gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl hover:border-[#00e87b]/40 transition"
                >
                  <span className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.04em] text-[#f4ead5] group-hover:text-[#00e87b] transition">
                    {s.label}
                  </span>
                  <span className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 group-hover:text-[#00e87b] transition">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <form
            action="https://formsubmit.co/soneselliot@gmail.com"
            method="POST"
            className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/10 h-fit"
          >
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
                className="w-full px-3 py-2.5 rounded-md bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition"
              />
            </div>
            <div className="mb-4">
              <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 rounded-md bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition"
              />
            </div>
            <div className="mb-5">
              <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Any details?</label>
              <textarea
                name="message"
                placeholder="Tell me what you're working on."
                rows={5}
                required
                className="w-full px-3 py-2.5 rounded-md bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-[#00e87b] text-[#0a1410] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
