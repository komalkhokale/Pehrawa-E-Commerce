import React from 'react'
import Hero from './Hero'
import ProductSection from "./ProductSection"
import { ShieldCheck, Sparkles, RotateCcw } from "lucide-react";
import { Truck} from "lucide-react";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Hero />
      <ProductSection />

      <section className="overflow-hidden border-y border-[#e4e2df] bg-[#1b1c1a] py-5">
        <div className="marquee">
          <div className="marquee-content">
            {[
              "FREE SHIPPING ABOVE ₹999",
              "PREMIUM QUALITY",
              "NEW ARRIVALS",
              "EASY RETURNS",
              "SECURE PAYMENTS",
              "COD AVAILABLE",
              "FREE SHIPPING ABOVE ₹999",
              "PREMIUM QUALITY",
              "NEW ARRIVALS",
              "EASY RETURNS",
              "SECURE PAYMENTS",
              "COD AVAILABLE",
            ].map((item, index) => (
              <span
                key={index}
                className="mx-8 text-[12px] uppercase tracking-[0.3em] text-[#f5f3ef]"
              >
                {item}
                <span className="ml-8 text-[#C9A96E]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#fbf9f6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
            {/* Left Image */}
            <div className="relative h-[620px] overflow-hidden bg-[#eee8df]">
              <img
                src="/snitch_editorial_warm.png"
                alt="Pehrawa editorial"
                className="h-full w-full object-cover object-center"
              />

              <div className="absolute bottom-8 left-8 bg-[#fbf9f6]/90 px-6 py-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E]">
                  New Season
                </p>

                <h3
                  className="mt-1 text-3xl font-light text-[#1b1c1a]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Linen Edit
                </h3>
              </div>
            </div>

            {/* Right Content */}
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
                Pehrawa Edit
              </p>

              <h2
                className="mt-5 text-5xl lg:text-6xl font-light leading-[1.05] text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Designed for quiet confidence.
              </h2>

              <p className="mt-6 text-sm leading-8 text-[#7A6E63]">
                Pehrawa brings clean silhouettes, soft fabrics and timeless
                details together for pieces that feel effortless every day.
              </p>

              {/* Stats */}
              <div className="mt-8 flex gap-10 border-y border-[#e4e2df] py-6">
                <div>
                  <h4
                    className="text-3xl font-light text-[#1b1c1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    50+
                  </h4>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#7A6E63]">
                    Styles
                  </p>
                </div>

                <div>
                  <h4
                    className="text-3xl font-light text-[#1b1c1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    24h
                  </h4>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#7A6E63]">
                    Dispatch
                  </p>
                </div>

                <div>
                  <h4
                    className="text-3xl font-light text-[#1b1c1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    7D
                  </h4>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#7A6E63]">
                    Returns
                  </p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Sparkles,
                    title: "Premium Fabric",
                    desc: "Soft textures for daily comfort.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Clean Fit",
                    desc: "Sharp silhouettes, easy movement.",
                  },
                  {
                    icon: RotateCcw,
                    title: "Easy Returns",
                    desc: "Simple exchange support.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group border border-[#e4e2df] bg-white/70 p-6 transition-all duration-300 hover:border-[#C9A96E] hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f7f3ee] group-hover:bg-[#C9A96E]/15 transition">
                        <Icon
                          size={22}
                          strokeWidth={1.7}
                          className="text-[#1b1c1a]"
                        />
                      </div>

                      <h3 className="mt-5 text-[11px] uppercase tracking-[0.22em] text-[#1b1c1a]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-xs leading-6 text-[#7A6E63]">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button className="mt-10 border border-[#1b1c1a] px-8 py-4 text-[10px] uppercase tracking-[0.25em] text-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-white transition">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
            Shop By Collection
          </p>

          <h2
            className="mt-4 text-5xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Discover Your Style
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Women */}
          <div
            onClick={() => navigate("/collection?gender=Women")}
            className="group relative overflow-hidden cursor-pointer"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/1.png"
                alt="Women Collection"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"></div>

          </div>

          {/* Men */}
          <div
            onClick={() => navigate("/collection?gender=Men")}
            className="group relative overflow-hidden cursor-pointer"
          >
            <div className="group relative overflow-hidden cursor-pointer">
              <img
                src="/2.png"
                alt="Men Collection"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

           
          </div>
        </div>
      </section>

      <section className="py-28 px-20">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
            Why Choose Us
          </p>

          <h2
            className="mt-4 text-5xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Crafted For Everyday Luxury
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-sm leading-7 text-[#7A6E63]">
            Every Pehrawa piece is thoughtfully designed with premium quality,
            timeless style and attention to every detail.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Sparkles,
              title: "Premium Quality",
              desc: "Carefully selected fabrics that feel soft and last longer.",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Quick and reliable shipping across India.",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "Simple return and exchange process with zero hassle.",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payments",
              desc: "100% safe checkout with trusted payment methods.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group border border-[#e4e2df] bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f3ee] transition-colors duration-300 group-hover:bg-[#C9A96E]/15">
                  <Icon
                    size={26}
                    strokeWidth={1.6}
                    className="text-[#1b1c1a]"
                  />
                </div>

                <h3
                  className="mt-7 text-lg font-light text-[#1b1c1a]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#7A6E63]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-28 bg-[#1b1c1a] px-8 py-16 text-center text-white">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E]">
          Join The Circle
        </p>

        <h2
          className="mt-4 text-4xl font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Get early access to new drops.
        </h2>

        <div className="mx-auto mt-8 flex max-w-md border border-white/30">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent px-4 py-4 text-sm outline-none placeholder:text-white/50"
          />
          <button className="bg-white px-6 text-[10px] uppercase tracking-[0.25em] text-[#1b1c1a]">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home