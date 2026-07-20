import { SectionHeader } from "@/components/site/SectionHeader";
import { ExperienceTimeline } from "@/components/site/ExperienceTimeline";
import { experience, certificates } from "@/lib/site-data";

export const metadata = { title: "Experience — Elliot Sones" };

function ResumeCard() {
  return (
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-4 flex items-center gap-4 rounded-[6px] border border-line bg-card p-4 transition-colors hover:border-ember"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-[#fdf3ec] font-[family-name:var(--font-jbmono)] text-[11px] font-medium text-ember">
        PDF
      </div>
      <div className="flex-1">
        <div className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-ink u-draw">
          Resume
        </div>
        <div className="mt-0.5 font-[family-name:var(--font-jbmono)] text-[10px] text-mute">
          Everything on this page, one document
        </div>
      </div>
      <span className="font-[family-name:var(--font-jbmono)] text-[11px] text-ember opacity-0 transition-opacity group-hover:opacity-100">
        Open ↗
      </span>
    </a>
  );
}

export default function ExperiencePage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <SectionHeader title="Experience" />
        <ResumeCard />
        <ExperienceTimeline
          items={experience}
          now={new Date().toISOString().slice(0, 7)}
        />
      </div>

      <div>
        <SectionHeader title="Certificates" />
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {certificates.map((c) => (
            <a
              key={c.title}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 rounded-[6px] border border-line bg-card p-3 transition-colors hover:border-ember"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={`${c.title} certificate`}
                className="h-16 w-24 shrink-0 rounded-[4px] border border-line object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="font-[family-name:var(--font-fraunces)] text-[14.5px] font-medium leading-snug text-ink u-draw">
                  {c.title}
                </div>
                <div className="mt-0.5 font-[family-name:var(--font-jbmono)] text-[9.5px] text-mute">
                  {c.issuer} · {c.date}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span key={s} className="badge badge-plain">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
