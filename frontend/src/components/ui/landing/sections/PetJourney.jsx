import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import PlaceholderFrame from "../PlaceholderFrame";
import j1 from "../../../../assets/landing/journey-1.jpg";
import j2 from "../../../../assets/landing/journey-2.jpg";
import j3 from "../../../../assets/landing/journey-3.jpg";
import j4 from "../../../../assets/landing/journey-4.jpg";
import j5 from "../../../../assets/landing/journey-5.jpg";

const STAGES = [
  { title: "Waiting room", copy: "A calm start, every time.", label: "Bright, quiet clinic waiting room", img: j1 },
  { title: "Examination", copy: "Careful, unhurried, thorough.", label: "Vet gently examining a dog on the table", img: j2 },
  { title: "Prescription", copy: "Clear next steps, no guesswork.", label: "Vet handing owner a printed care plan", img: j3 },
  { title: "Recovery", copy: "Comfort while they heal.", label: "Pet resting at home on a soft bed", img: j4 },
  { title: "Home again", copy: "Back to being themselves.", label: "Dog playing happily in a sunny yard", img: j5 },
];

export default function PetJourney() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const distance = () => trackRef.current.scrollWidth - window.innerWidth;

      const tween = gsap.to(trackRef.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => tween.scrollTrigger && tween.scrollTrigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#FBF8F3]">
      <div ref={trackRef} className="flex h-full w-max">
        <div className="w-screen h-full flex-shrink-0 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[#B5703A] text-xs uppercase tracking-[0.3em] font-medium mb-4">The journey</p>
          <h2 className="vs-serif text-[#3D3A34] text-4xl md:text-6xl font-medium max-w-2xl">
            From the first appointment to a lifetime of care.
          </h2>
        </div>

        {STAGES.map((stage) => (
          <div key={stage.n} className="w-screen h-full flex-shrink-0 relative">
            <PlaceholderFrame label={stage.label} theme="cream" rounded="rounded-none" className="absolute inset-0 w-full h-full" src={stage.img} alt={stage.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A34]/65 via-transparent to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-20 max-w-xl">
              <span className="text-white/70 text-sm font-medium tracking-[0.2em] mb-3">{stage.n}</span>
              <h3 className="vs-serif text-white text-3xl md:text-5xl font-medium mb-3">{stage.title}</h3>
              <p className="text-white/80 text-base">{stage.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
