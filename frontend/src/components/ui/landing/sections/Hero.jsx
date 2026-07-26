import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import PlaceholderFrame from "../PlaceholderFrame";
import heroImg from "../../../../assets/landing/hero-dog.jpg";

export default function Hero() {
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(imgRef.current, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 })
        .fromTo(eyebrowRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.9")
        .fromTo(headingRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
        .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5");

      gsap.to(imgRef.current, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative h-screen w-full overflow-hidden bg-[#FBF8F3]">
      <PlaceholderFrame
        innerRef={imgRef}
        label="Golden retriever, close-up portrait, soft morning window light, dust in the air"
        theme="cream"
        rounded="rounded-none"
        className="absolute inset-0 w-full h-full"
        src={heroImg}
        alt="Golden retriever in warm morning light"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A34]/70 via-[#3D3A34]/10 to-transparent" />

      <div className="relative z-10 h-full w-full flex flex-col justify-end px-8 md:px-16 pb-24 md:pb-28 max-w-4xl">
        <p ref={eyebrowRef} className="text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] font-medium mb-5">
          VetSphere
        </p>
        <h1 ref={headingRef} className="vs-serif text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05] font-medium mb-6">
          Every life deserves
          <br />
          extraordinary care.
        </h1>
        <p ref={subRef} className="text-white/85 text-base md:text-lg max-w-xl">
          Built for pets. Trusted by families. Powered by verified veterinarians.
        </p>
      </div>
    </section>
  );
}
