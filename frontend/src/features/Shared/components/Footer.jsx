import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import { HiArrowUpRight } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="bg-[#161616] text-white mt-28">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
        {/* Top */}
        <div className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 border-b border-white/10">
          {/* Left */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
              Pehrawa
            </p>

            <h2
              className="mt-5 text-5xl lg:text-6xl font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Wear Your Identity.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-8 text-white/60">
              Premium everyday clothing inspired by timeless design, effortless
              comfort and modern minimalism.
            </p>

            <button className="mt-10 flex items-center gap-3 border border-white px-8 py-4 text-[10px] uppercase tracking-[0.3em] transition hover:bg-white hover:text-[#161616]">
              Explore Collection
              <HiArrowUpRight size={18} />
            </button>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* Shop */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#C9A96E] mb-6">
                Shop
              </h3>

              <ul className="space-y-4 text-white/70 text-sm">
                <li>
                  <Link to="/collection" className="hover:text-[#C9A96E]">
                    Collection
                  </Link>
                </li>

                <li>
                  <Link to="/" className="hover:text-[#C9A96E]">
                    Men
                  </Link>
                </li>

                <li>
                  <Link to="/" className="hover:text-[#C9A96E]">
                    Women
                  </Link>
                </li>

                <li>
                  <Link to="/" className="hover:text-[#C9A96E]">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#C9A96E] mb-6">
                Company
              </h3>

              <ul className="space-y-4 text-white/70 text-sm">
                <li>
                  <Link to="/about" className="hover:text-[#C9A96E]">
                    About
                  </Link>
                </li>

                <li>
                  <Link to="/contact" className="hover:text-[#C9A96E]">
                    Contact
                  </Link>
                </li>

                <li>
                  <Link to="/" className="hover:text-[#C9A96E]">
                    FAQ
                  </Link>
                </li>

                <li>
                  <Link to="/" className="hover:text-[#C9A96E]">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#C9A96E] mb-6">
                Follow
              </h3>

              <div className="flex gap-2 text-lg">
                <a
                  href="#"
                  className="w-20 h-8 border border-white/20 flex items-center justify-center hover:bg-[#C9A96E] hover:text-[#161616] transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  className="w-20 h-8 border border-white/20 flex items-center justify-center hover:bg-[#C9A96E] hover:text-[#161616] transition"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="#"
                  className="w-20 h-8 border border-white/20 flex items-center justify-center hover:bg-[#C9A96E] hover:text-[#161616] transition"
                >
                  <FaXTwitter />
                </a>

                <a
                  href="#"
                  className="w-20 h-8 border border-white/20 flex items-center justify-center hover:bg-[#C9A96E] hover:text-[#161616] transition"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-[11px] uppercase tracking-[0.2em] text-white/40">
          <p className="flex justify-between items-center">
            © {new Date().getFullYear()} Pehrawa. ALL RIGHTS RESERVED.
          </p>

          <span>Made with ❤️ by Komal.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
