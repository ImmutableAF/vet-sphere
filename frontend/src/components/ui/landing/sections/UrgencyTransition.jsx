import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import PlaceholderFrame from "../PlaceholderFrame";
import UrgencyImg from "../../../../assets/landing/urgency-owner.jpg";

export default function UrgencyTransition() {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const overlayRef = useRef(null);
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

      tl.fromTo(overlayRef.current, { opacity: 0.25 }, { opacity: 0.75, duration: 1, ease: "none" }, 0)
        .fromTo(line1Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.15 }, 0.1)
        .to(line1Ref.current, { opacity: 0, y: -14, duration: 0.15 }, 0.38)
        .fromTo(line2Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.15 }, 0.55)
        .to(imgRef.current, { borderRadius: 32, scale: 0.94, duration: 0.25, ease: "power2.inOut" }, 0.75);
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[160vh] bg-[#3D3A34]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <PlaceholderFrame
          innerRef={imgRef}
          label="Worried owner at home, phone in hand, rain against the window"
          theme="dark"
          rounded="rounded-none"
          className="absolute inset-0 w-full h-full"
          src={UrgencyImg}
        />
        <div ref={overlayRef} className="absolute inset-0 bg-[#100D18]" />

        <div className="relative z-10 px-8 text-center">
          <h2
            ref={line1Ref}
            className="vs-serif absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl lg:text-7xl font-medium opacity-0"
          >
            When they need us most —
          </h2>
          <h2
            ref={line2Ref}
            className="vs-serif absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl lg:text-7xl font-medium opacity-0"
          >
            finding care shouldn't take time.
          </h2>
        </div>
      </div>
    </div>
  );
}
