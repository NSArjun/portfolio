import type { ReactNode } from "react";
import { SECTION_TAGS, type SectionId } from "@/lib/data";

type Props = {
  id: SectionId;
  label: string;
  /** Leading words of the heading (bold sans) */
  title: ReactNode;
  /** Final italic serif word */
  accent: string;
  headingId?: string;
  className?: string;
};

export function SectionHead({ id, label, title, accent, headingId, className = "" }: Props) {
  return (
    <header className={className}>
      <p className="tag rv">
        {SECTION_TAGS[id]} — {label}
      </p>
      <h2 className="h2" id={headingId ?? `${id}-title`}>
        <span className="rv-mask">
          <span>
            {title} <span className="accent">{accent}</span>
          </span>
        </span>
      </h2>
    </header>
  );
}
