import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const PageTransition = () => {
  const location = useLocation();

  useEffect(() => {
    gsap.to(".page-transition", {
      y: "-100%",
      duration: 0.8,
      delay: 0.2,
      ease: "power4.inOut",
    });
  }, [location.pathname]);

  return (
    <div className="page-transition fixed inset-0 z-[99999] translate-y-full bg-[#15130f] flex items-center justify-center">
      <h1
        className="text-5xl tracking-[0.45em] text-[#f7f3ec]"
        style={{ fontFamily: "serif" }}
      >
        Pehrawa
      </h1>
    </div>
  );
};

export default PageTransition;
