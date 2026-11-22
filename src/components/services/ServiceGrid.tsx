import { Reveal } from "@/components/animations/Reveal";
import { services } from "@/data/services";
import { ServiceCard } from "./ServiceCard";

/** One even grid: 1 column on phones, 2 on tablets, 3 on desktop. Six services fill two full rows of three. */
export function ServiceGrid() {
  return (
    <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <li key={s.slug}>
          <Reveal delay={(i % 3) * 0.08} className="h-full">
            <ServiceCard service={s} ratio="tall" />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
