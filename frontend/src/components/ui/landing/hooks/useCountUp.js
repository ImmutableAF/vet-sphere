import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../gsapSetup";

export default function useCountUp(target, { duration = 1.6, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const counter = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration,
          ease: "power2.out",
          onUpdate: () => setValue(counter.val),
        });
      },
    });

    return () => trigger.kill();
  }, [target, duration]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return [ref, display];
}
