import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const TransitionLink = ({ to, children, className }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    const tl = gsap.timeline();

    tl.to(".page-transition", {
      y: "0%",
      duration: 0.7,
      ease: "power4.inOut",
    }).call(() => {
      navigate(to);
    });
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default TransitionLink;
