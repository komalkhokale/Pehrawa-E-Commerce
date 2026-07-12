import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Real editorial photography (Unsplash License — free for commercial use,
 * no attribution required). Swap these for your own shoot whenever ready,
 * the layout/animation logic doesn't need to change.
 */
const heroImages = [
  "/3.png",
  "/6.png",
  "/4.png",
  "/7.png",
  "/5.png",

];

const heroAlt = [
  "Editorial black gown, side profile",
  "Model in tailored black corset look",
  "Off-shoulder black dress with front slit",
  "Structured mini dress with boots",
  "Monochrome tailored evening look",
];

// Real sequence — each panel is a distinct look in the capsule, so the
// number is information, not decoration.
const lookLabels = ["Look 01", "Look 02", "Look 03", "Look 04", "Look 05"];

/**
 * Panel geometry per breakpoint. Only numbers change here — sizes get
 * smaller and the fan spreads in tighter as the viewport narrows so the
 * five panels never overflow the screen or clip on mobile.
 */
const breakpointConfig = {
  desktop: {
    sizes: [
      { w: 200, h: 370 },
      { w: 220, h: 400 },
      { w: 250, h: 500 },
      { w: 220, h: 400 },
      { w: 200, h: 370 },
    ],
    spread: [-460, -250, 0, 250, 460],
    rotate: [-7, -3.5, 0, 3.5, 7],
    lift: [40, -30, -55, -25, 45],
    delay: [0.06, 0, 0, 0.02, 0.08],
  },
  tablet: {
    sizes: [
      { w: 122, h: 236 },
      { w: 134, h: 270 },
      { w: 156, h: 322 },
      { w: 134, h: 270 },
      { w: 122, h: 236 },
    ],
    spread: [-236, -124, 0, 124, 236],
    rotate: [-6, -3, 0, 3, 6],
    lift: [28, -22, -38, -18, 30],
    delay: [0.05, 0, 0, 0.02, 0.07],
  },
  mobile: {
    sizes: [
      { w: 88, h: 172 },
      { w: 96, h: 194 },
      { w: 114, h: 228 },
      { w: 96, h: 194 },
      { w: 88, h: 172 },
    ],
    spread: [-120, -64, 0, 64, 120],
    rotate: [-5, -2.5, 0, 2.5, 5],
    lift: [18, -14, -24, -12, 20],
    delay: [0.04, 0, 0, 0.02, 0.06],
  },
};

function getConfigForWidth(w) {
  if (w >= 1024) return breakpointConfig.desktop;
  if (w >= 768) return breakpointConfig.tablet;
  return breakpointConfig.mobile;
}

const Hero = ({ navOffset = 84 }) => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const panelRefs = useRef([]);
  const labelRefs = useRef([]);
  const paraRef = useRef(null);
  const headingRef = useRef(null);
  const eyebrowRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollHintRef = useRef(null);
  const isLightRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelRefs.current;
      const labels = labelRefs.current;

      const applyBaseGeometry = (config) => {
        panels.forEach((panel, i) => {
          gsap.set(panel, {
            width: config.sizes[i].w,
            height: config.sizes[i].h,
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
          });
        });
        gsap.set([panels[0], panels[1], panels[3], panels[4]], {
          x: 0,
          opacity: 0,
          scale: 0.88,
          rotate: 0,
        });
        gsap.set(labels, { opacity: 0, y: 8 });
      };

      // Lay everything out immediately so nothing flashes unsized, and put
      // the hero image below its resting spot so the intro can lift it in.
      const initialConfig = getConfigForWidth(window.innerWidth);
      applyBaseGeometry(initialConfig);
      gsap.set(panels[2], { x: 0, y: 140, opacity: 0, scale: 1, rotate: 0 });

      // ---- Intro (plays once, is NOT scroll-linked) ----
      // Runs to completion on its own timeline first. The scroll-driven
      // fan-out is only built once this finishes, so the two animations
      // never fight over the same properties (that fight was the source
      // of the jump/glitch — the scrubbed timeline was re-asserting its
      // own start values on top of the still-playing intro).
      const introTl = gsap.timeline({ delay: 0.15 });
      introTl
        .to(
          panels[2],
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
          0,
        )
        .from(
          eyebrowRef.current,
          { opacity: 0, y: 14, duration: 0.8, ease: "power3.out" },
          0.1,
        )
        .from(
          paraRef.current,
          { opacity: 0, y: 20, duration: 0.9, ease: "power3.out" },
          0.2,
        )
        .from(
          headingRef.current,
          { opacity: 0, y: 20, duration: 0.9, ease: "power3.out" },
          0.3,
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 14, duration: 0.8, ease: "power3.out" },
          0.55,
        )
        .from(
          scrollHintRef.current,
          { opacity: 0, duration: 0.9, ease: "power2.out" },
          0.6,
        );

      // idle bob on the scroll cue — independent, harmless to start any time
      gsap.to(scrollHintRef.current.querySelector(".scroll-dot"), {
        y: 10,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      let mm;

      const buildScrollAnimation = () => {
        mm = gsap.matchMedia();
        mm.add(
          {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
          },
          (context) => {
            const { isDesktop, isTablet } = context.conditions;
            const config = isDesktop
              ? breakpointConfig.desktop
              : isTablet
                ? breakpointConfig.tablet
                : breakpointConfig.mobile;

            // re-apply sizing for the matched breakpoint (idempotent, safe
            // to call again on resize)
            applyBaseGeometry(config);
            gsap.set(panels[2], {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
            });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=150%",
                scrub: 1,
                pin: pinRef.current,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  // Flip the light/dark palette once, via a CSS transition,
                  // instead of tweening background/text colors on every
                  // scroll tick. Continuous color tweens force a repaint
                  // each frame and are the main source of scroll jank here —
                  // transforms and opacity (used everywhere else) are the
                  // only properties cheap enough to scrub smoothly.
                  const shouldBeLight = self.progress > 0.5;
                  if (shouldBeLight !== isLightRef.current) {
                    isLightRef.current = shouldBeLight;
                    pinRef.current.style.backgroundColor = shouldBeLight
                      ? "#f7f3ec"
                      : "#15130f";
                    paraRef.current.style.color = shouldBeLight
                      ? "#7A6E63"
                      : "#d8d1c4";
                    eyebrowRef.current.style.color = shouldBeLight
                      ? "#a9784f"
                      : "#a9784f";
                    headingRef.current.style.color = shouldBeLight
                      ? "#1b1a17"
                      : "#f5f1ea";
                    labels.forEach((el) => {
                      if (el)
                        el.style.color = shouldBeLight ? "#7A6E63" : "#f5f1ea";
                    });
                  }
                },
              },
            });

            // Scrubbed tweens use ease: "none" — the scrub value itself is
            // what supplies the smoothing/lag. Combining scrub with a power
            // ease double-applies easing (the motion speeds up/slows down
            // unevenly relative to scroll input), which reads as jittery.
            [1, 3, 0, 4].forEach((i) => {
              tl.to(
                panels[i],
                {
                  x: config.spread[i],
                  y: config.lift[i],
                  rotate: config.rotate[i],

                  rotationY: config.rotate[i] * 3,
                  rotationX: i === 2 ? 0 : 8,
                  transformPerspective: 2500,
                  transformStyle: "preserve-3d",

                  opacity: 1,
                  scale: i === 0 || i === 4 ? 0.92 : 1,
                  duration: 1,
                  ease: "none",
                },
                config.delay[i],
              );
            });
            tl.to(
              panels[2],
              { y: config.lift[2], scale: 0.95, duration: 1, ease: "none" },
              0,
            )
              .to(
                labels,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "none",
                  stagger: 0.04,
                },
                0.55,
              )
              .to(
                scrollHintRef.current,
                { opacity: 0, duration: 0.3, ease: "none" },
                0.05,
              )
              .to(
                ctaRef.current,
                { opacity: 0, y: -8, duration: 0.3, ease: "none" },
                0.05,
              );

            return () => {
              tl.scrollTrigger && tl.scrollTrigger.kill();
              tl.kill();
            };
          },
        );
      };

      introTl.eventCallback("onComplete", buildScrollAnimation);

      return () => {
        introTl.kill();
        if (mm) mm.revert();
      };
    }, sectionRef);

    // Only refresh ScrollTrigger's measurements if the person hasn't
    // started scrolling yet. Refreshing while they're mid-scroll (e.g. a
    // late-loading font shifts layout a moment after the page opened) is
    // itself what can cause a visible jump — so we only correct the
    // measurement pre-emptively, never interrupt an in-progress scroll.
    const safeRefresh = () => {
      if (window.scrollY < 40) ScrollTrigger.refresh();
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(safeRefresh);
    }
    window.addEventListener("load", safeRefresh);
    const imgs = sectionRef.current
      ? Array.from(sectionRef.current.querySelectorAll("img"))
      : [];
    imgs.forEach((img) => {
      if (!img.complete)
        img.addEventListener("load", safeRefresh, { once: true });
    });

    return () => {
      ctx.revert();
      window.removeEventListener("load", safeRefresh);
      imgs.forEach((img) => img.removeEventListener("load", safeRefresh));
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ height: "250vh" }}
      className="relative"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden transition-colors duration-700 ease-out"
        style={{ backgroundColor: "#15130f" }}
      >
        {/* text row — offset below your real navbar (navOffset prop) so it
            never sits underneath it */}
        <div
          className="absolute inset-x-0 px-5 sm:px-8 lg:px-16 flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-5 z-20"
          style={{ top: navOffset + 24 }}
        >
          <div className="flex flex-col gap-3 max-w-[240px] sm:max-w-xs">
            <p
              ref={eyebrowRef}
              className="text-[10px] uppercase tracking-[0.32em] flex items-center gap-3 transition-colors duration-700 ease-out"
              style={{ color: "#a9784f", fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="inline-block w-6 h-px"
                style={{ background: "#a9784f" }}
              />
              Pehrawa &nbsp;—&nbsp; SS&apos;26
            </p>
            <p
              ref={paraRef}
              className="text-[11px] sm:text-[12px] leading-relaxed transition-colors duration-700 ease-out"
              style={{ color: "#d8d1c4", fontFamily: "'Inter', sans-serif" }}
            >
              Pehrawa crafts pieces that move with you — quiet tailoring,
              considered detail, made to be worn on your own terms.
            </p>
          </div>

          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl lg:text-5xl uppercase tracking-tight leading-[0.95] lg:text-right transition-colors duration-700 ease-out"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#f5f1ea",
            }}
          >
            Tailored to
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>
              turn heads.
            </span>
          </h2>
        </div>

        {/* fan panels */}
        <div
          className="relative w-full h-full mt-20"
          style={{
            // perspective: "1500px",
            // transformStyle: "preserve-3d",
          }}
        >
          {heroImages.map((src, i) => (
            <div
              key={i}
              ref={(el) => (panelRefs.current[i] = el)}
              className="absolute rounded-[4px] overflow-hidden"
              style={{
                willChange: "transform, opacity",
                boxShadow: "0 24px 48px -18px rgba(10, 8, 5, 0.5)",
                outline: "1px solid rgba(245, 241, 234, 0.14)",
                outlineOffset: "-1px",
              }}
            >
              <img
                src={src}
                alt={heroAlt[i]}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 100%)",
                }}
              />
              <span
                ref={(el) => (labelRefs.current[i] = el)}
                className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-700 ease-out"
                style={{ color: "#f5f1ea", fontFamily: "'Inter', sans-serif" }}
              >
                {lookLabels[i]}
              </span>
            </div>
          ))}
        </div>

        {/* CTA — visible only during the intro, fades before the scroll cue */}
        <div
          ref={ctaRef}
          className="absolute bottom-24 sm:bottom-28 inset-x-0 flex justify-center z-20"
        >
          <button
            type="button"
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.24em] transition-colors duration-300"
            style={{
              border: "1px solid rgba(245,241,234,0.4)",
              color: "#f5f1ea",
              fontFamily: "'Inter', sans-serif",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f1ea";
              e.currentTarget.style.color = "#15130f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#f5f1ea";
            }}
          >
            Explore the collection
          </button>
        </div>

        {/* minimal scroll cue */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 sm:bottom-10 inset-x-0 flex flex-col items-center gap-2 z-20"
          style={{ color: "#f5f1ea" }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{ fontFamily: "'Inter', sans-serif", opacity: 0.7 }}
          >
            Scroll
          </span>
          <span
            className="w-px h-8 sm:h-10 overflow-hidden"
            style={{ background: "rgba(245,241,234,0.25)" }}
          >
            <span
              className="scroll-dot block w-px h-3"
              style={{ background: "#f5f1ea" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
