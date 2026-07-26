import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import PlaceholderFrame from "../PlaceholderFrame";
import vet1 from "../../../../assets/landing/vet-1.jpg";
import vet2 from "../../../../assets/landing/vet-2.jpg";
import vet3 from "../../../../assets/landing/vet-3.jpg";


const VETS = [
  { name: "Dr. Marcus Ade", focus: "Small animal medicine", years: "9 yrs", rating: "4.9", available: "Today", label: "Vet adjusting exam gloves, focused expression", img: vet1 },
  { name: "Dr. Priya Nair", focus: "Feline specialist", years: "12 yrs", rating: "4.8", available: "Tomorrow", label: "Vet examining a cat on a steel table, warm light", img: vet2 },
  { name: "Dr. Edward Ostrowski", focus: "Emergency & critical care", years: "7 yrs", rating: "5.0", available: "Now", label: "Vet smiling warmly at a pet owner in a clinic hallway", img: vet3 },
];

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function VerifiedVets() {
  return (
    <section className="relative w-full bg-[#FBF8F3] px-6 md:px-16 py-28">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6 }}
        className="text-[#B5703A] text-xs uppercase tracking-[0.3em] font-medium mb-3 text-center"
      >
        Verified expertise
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="vs-serif text-[#3D3A34] text-4xl md:text-6xl font-medium mb-16 text-center"
      >
        Trusted professionals.
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {VETS.map((vet) => (
          <motion.div key={vet.name} variants={item} className="relative rounded-[28px] overflow-hidden">
            <PlaceholderFrame label={vet.label} theme="purple" rounded="rounded-[28px]" className="aspect-[3/4] w-full" src={vet.img} alt={vet.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A34]/80 via-transparent to-transparent" />

            <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/70 backdrop-blur px-3 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B4B8A]" strokeWidth={1.75} />
              <span className="text-[10px] font-medium text-[#3D3A34]">Verified</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white text-lg font-medium mb-0.5">{vet.name}</p>
              <p className="text-white/75 text-xs mb-3">
                {vet.focus} · {vet.years}
              </p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-white/90 text-xs">
                  <Star className="w-3.5 h-3.5 fill-white text-white" /> {vet.rating}
                </span>
                <span className="rounded-full bg-white/20 border border-white/30 px-3 py-1 text-[10px] font-medium text-white">
                  Available {vet.available}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
