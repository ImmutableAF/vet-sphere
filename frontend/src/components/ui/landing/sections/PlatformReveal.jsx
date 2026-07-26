import { motion } from "framer-motion";
import { CalendarCheck, ShieldCheck, Syringe, FileClock, Star, Check } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      variants={cardVariants}
      className={`backdrop-blur-xl bg-white/40 border border-white/60 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(91,75,138,0.15)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function PlatformReveal() {
  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-16 py-24"
      style={{ background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="text-[#5B4B8A] text-xs uppercase tracking-[0.3em] font-medium mb-4"
      >
        Introducing
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="vs-serif text-[#3D3A34] text-4xl md:text-6xl font-medium mb-16 text-center"
      >
        Meet VetSphere.
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.14 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl"
      >
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-4 h-4 text-[#5B4B8A]" strokeWidth={1.75} />
            <p className="text-[#3D3A34] text-sm font-medium">Book a visit</p>
          </div>
          <p className="text-[#3D3A34]/70 text-xs mb-1">Dr. Alvarez · General checkup</p>
          <div className="flex items-center justify-between mt-4">
            <span className="rounded-full bg-white/60 border border-white/70 px-4 py-2 text-xs font-medium text-[#3D3A34]">
              Tomorrow, 2:00 PM
            </span>
            <span className="rounded-full bg-[#5B4B8A] px-4 py-2 text-xs font-medium text-white">Confirm</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-[#5B4B8A]" strokeWidth={1.75} />
            <p className="text-[#3D3A34] text-sm font-medium">Verified vets</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/60 border border-white/70" />
            <div className="flex-1">
              <p className="text-[#3D3A34] text-xs font-medium">Dr. Priya Nair</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-[#8A6FC7] fill-[#8A6FC7]" />
                <span className="text-[#3D3A34]/70 text-[11px]">4.9 · Small animal</span>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-white/60 border border-white/70 px-3 py-1.5 text-[10px] font-medium text-[#3D3A34]">
              <Check className="w-3 h-3" /> Verified
            </span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Syringe className="w-4 h-4 text-[#5B4B8A]" strokeWidth={1.75} />
            <p className="text-[#3D3A34] text-sm font-medium">Vaccination reminders</p>
          </div>
          {["Rabies booster", "Bordetella"].map((label) => (
            <div key={label} className="flex items-center justify-between py-1.5">
              <span className="text-[#3D3A34]/80 text-xs">{label}</span>
              <span className="rounded-full bg-white/60 border border-white/70 px-3 py-1 text-[10px] font-medium text-[#3D3A34]">
                Due in 12 days
              </span>
            </div>
          ))}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <FileClock className="w-4 h-4 text-[#5B4B8A]" strokeWidth={1.75} />
            <p className="text-[#3D3A34] text-sm font-medium">Medical history</p>
          </div>
          {["Annual exam — Mar 2026", "Dental cleaning — Nov 2025"].map((label) => (
            <div key={label} className="flex items-center gap-2 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A6FC7]" />
              <span className="text-[#3D3A34]/80 text-xs">{label}</span>
            </div>
          ))}
        </GlassCard>
      </motion.div>
    </section>
  );
}
