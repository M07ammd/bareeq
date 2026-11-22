import { Reveal } from "@/components/animations/Reveal";
import { SplitReveal } from "@/components/animations/SplitReveal";

type Props = {
  title: string;
  description?: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
  id?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({
  title,
  description,
  tone = "light",
  align = "start",
  id,
  as: Tag = "h2",
}: Props) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Tag
        id={id}
        className={`text-3xl font-bold md:text-5xl ${dark ? "text-white" : "text-navy"}`}
      >
        <SplitReveal text={title} />
      </Tag>
      {description && (
        <Reveal delay={0.25} y={16}>
          <p className={`mt-5 text-lg md:text-xl ${dark ? "text-white/75" : "text-ink-soft"}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
