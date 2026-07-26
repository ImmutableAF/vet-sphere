import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { gsap } from "../gsapSetup";
import PlaceholderFrame from "../PlaceholderFrame";
import emergencyMap from "../../../../assets/landing/emergency-map.png";
const CLINICS = [
  { name: "Riverside Emergency Vet", distance: "1.2 mi", status: "Open now" },
  { name: "Northgate Animal ER", distance: "2.8 mi", status: "Open now" },
  { name: "Companion Critical Care", distance: "4.1 mi", status: "12 min away" },
];

function EmergencyHeadline() {
  const wrapperRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.fromTo(line1Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.2 }, 0.08)
        .to(line1Ref.current, { opacity: 0, y: -14, duration: 0.2 }, 0.42)
        .fromTo(line2Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.2 }, 0.62);
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[140vh] bg-[#100D18]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-8">
        <div className="relative w-full flex items-center justify-center">
          <h2
            ref={line1Ref}
            className="vs-serif absolute text-white text-4xl md:text-6xl lg:text-7xl font-medium text-center opacity-0"
          >
            Emergencies don't wait.
          </h2>
          <h2
            ref={line2Ref}
            className="vs-serif absolute text-white text-4xl md:text-6xl lg:text-7xl font-medium text-center opacity-0"
          >
            Neither do we.
          </h2>
        </div>
      </div>
    </div>
  );
}

function EmergencyPanel() {
  return (
    <section className="relative w-full bg-[#100D18] px-6 md:px-16 pb-28 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto"
      >
      <PlaceholderFrame
        label="Map view — nearby emergency clinics highlighted"
        theme="dark"
        rounded="rounded-[28px]"
        className="aspect-[4/3] md:aspect-auto md:min-h-[360px] w-full"
        src={emergencyMap}
        alt="Map showing nearby emergency clinics"
      />

        <div className="backdrop-blur-xl bg-white/[0.06] border border-white/15 rounded-[28px] p-6 flex flex-col">
          <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">Nearby emergency care</p>
          <div className="flex flex-col gap-3 flex-1">
            {CLINICS.map((clinic) => (
              <div
                key={clinic.name}
                className="flex items-center justify-between rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#E4664A]" strokeWidth={1.75} />
                  <div>
                    <p className="text-white text-sm font-medium">{clinic.name}</p>
                    <p className="text-white/50 text-xs">{clinic.distance} · {clinic.status}</p>
                  </div>
                </div>
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E4664A]">
                  <Phone className="w-4 h-4 text-white" strokeWidth={1.75} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function EmergencyServices() {
  return (
    <>
      <EmergencyHeadline />
      <EmergencyPanel />
    </>
  );
}
