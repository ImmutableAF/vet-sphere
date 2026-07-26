import useCountUp from "../hooks/useCountUp";
import PlaceholderFrame from "../PlaceholderFrame";
import statspets from "../../../../assets/landing/stats-pets.jpg";

const STATS = [
  { target: 50000, suffix: "+", label: "Happy pets" },
  { target: 1200, suffix: "+", label: "Verified veterinarians" },
  { target: 250000, suffix: "+", label: "Appointments booked" },
  { target: 98, suffix: "%", label: "Satisfaction rate" },
];

function Stat({ target, suffix, label }) {
  const [ref, display] = useCountUp(target, { duration: 1.8 });

  return (
    <div ref={ref} className="text-center">
      <p className="vs-serif text-white text-5xl md:text-7xl font-medium">
        {display}
        {suffix}
      </p>
      <p className="text-white/65 text-xs md:text-sm uppercase tracking-[0.2em] font-medium mt-3">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <PlaceholderFrame
        label="Slow-motion footage — pets playing outdoors, golden light"
        theme="purple"
        rounded="rounded-none"
        className="absolute inset-0 w-full h-full"
        src={statspets}
      />
      <div className="absolute inset-0 bg-[#3D3A34]/70" />

      <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-16 px-8 py-24 max-w-4xl w-full">
        {STATS.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
