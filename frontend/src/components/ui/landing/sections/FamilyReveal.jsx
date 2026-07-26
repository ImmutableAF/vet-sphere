import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import PlaceholderFrame from "../PlaceholderFrame";
import FamilyRevealImg from "../../../../assets/landing/family-reveal.jpg";

export default function FamilyReveal() {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
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

      tl.fromTo(imgRef.current, { scale: 1.55 }, { scale: 1, duration: 1, ease: "none" }, 0)
        .fromTo(line1Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.15 }, 0.06)
        .to(line1Ref.current, { opacity: 0, y: -14, duration: 0.15 }, 0.34)
        .fromTo(line2Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.15 }, 0.55);
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[180vh] bg-[#FBF8F3]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <PlaceholderFrame
          innerRef={imgRef}
          label="Golden retriever lying in a modern living room, child gently petting them"
          theme="cream"
          rounded="rounded-none"
          className="absolute inset-0 w-full h-full"
          src={FamilyRevealImg}
        />
        <div className="absolute inset-0 bg-[#3D3A34]/25" />

        <div className="relative z-10 h-full w-full flex items-center justify-center px-8">
          <h2
            ref={line1Ref}
            className="vs-serif absolute text-white text-4xl md:text-6xl lg:text-7xl font-medium text-center opacity-0"
          >
            They are more than pets.
          </h2>
          <h2
            ref={line2Ref}
            className="vs-serif absolute text-white text-4xl md:text-6xl lg:text-7xl font-medium text-center opacity-0"
          >
            They are family.
          </h2>
        </div>
      </div>
    </div>
  );
}
