import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../gsapSetup";
import PlaceholderFrame from "../PlaceholderFrame";
import FinCTA from "../../../../assets/landing/final-cta.jpg";

export default function FinalCTA() {
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { y: 0, scale: 1.1 },
        {
          y: -60,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "top top", scrub: true },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 60%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative h-screen w-full overflow-hidden bg-[#3D3A34]">
      <PlaceholderFrame
        innerRef={imgRef}
        label="Dog, cat, rabbit and bird together at golden hour, facing the sunset"
        theme="cream"
        rounded="rounded-none"
        className="absolute inset-0 w-full h-full"
        src={FinCTA}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A34]/85 via-[#3D3A34]/25 to-transparent" />

      <div ref={contentRef} className="relative z-10 h-full w-full flex flex-col items-center justify-end px-8 pb-24 text-center">

        <h2 className="vs-serif text-white text-4xl md:text-6xl lg:text-7xl font-medium max-w-3xl mb-10">
          Because every heartbeat matters.
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/login"
            className="rounded-full bg-[#B5703A] px-7 py-3 text-sm font-medium text-white hover:bg-[#a3612f] transition-colors"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Find a veterinarian
          </Link>
        </div>
      </div>
    </section>
  );
}
