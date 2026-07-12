import React from "react";
 import { Star } from "lucide-react";

const About = () => {
  return (
    <main className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a]">
      <section className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
              About Pehrawa
            </p>

            <h1
              className="mt-5 text-6xl lg:text-7xl font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Wear Your Identity.
            </h1>

            <p className="mt-6 text-sm leading-8 text-[#7A6E63] max-w-xl">
              Pehrawa is a modern clothing label created for people who love
              clean silhouettes, premium comfort and timeless everyday style.
              Every piece is designed to feel effortless, elegant and personal.
            </p>

            <button className="mt-10 border border-[#1b1c1a] px-8 py-4 text-[10px] uppercase tracking-[0.25em] hover:bg-[#1b1c1a] hover:text-white transition">
              Explore Collection
            </button>
          </div>

          <div className="relative h-[620px] w-xl overflow-hidden bg-[#eee8df]">
            <img
              src="/about.png"
              alt="About Pehrawa"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>
      <section className="border-y bg-[#f7f4ef] border-[#e4e2df] py-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            [
              "01",
              "Minimal Design",
              "Simple details, clean cuts and premium finishing.",
            ],
            [
              "02",
              "Everyday Comfort",
              "Soft fabrics made for daily wear and movement.",
            ],
            [
              "03",
              "Timeless Style",
              "Pieces that stay relevant beyond seasonal trends.",
            ],
          ].map(([num, title, desc]) => (
            <div key={title}>
              <p className="text-[10px] tracking-[0.3em] text-[#C9A96E]">
                {num}
              </p>

              <h3 className="mt-4 text-sm uppercase tracking-[0.25em]">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#7A6E63]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
          Our Philosophy
        </p>

        <h2
          className="mt-5 text-5xl font-light leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Fashion should feel personal, not complicated.
        </h2>

        <p className="mt-6 text-sm leading-8 text-[#7A6E63]">
          We believe clothing should help you express yourself with confidence.
          Pehrawa focuses on versatile pieces that can move with your lifestyle,
          your mood and your identity.
        </p>
      </section>

      <section className="py-28 bg-[#f7f4ef]">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
          <div className="text-center">
            <h2
              className="mt-4 text-5xl font-light text-[#1b1c1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Loved by Our Customers
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-sm leading-7 text-[#7A6E63]">
              Every review inspires us to create timeless pieces with premium
              quality and comfort.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Aarav Sharma",
                city: "Mumbai",
                review:
                  "The fabric quality exceeded my expectations. The fit is clean and the finish feels premium.",
              },
              {
                name: "Priya Patel",
                city: "Ahmedabad",
                review:
                  "Minimal design with amazing comfort. I've already ordered another one for my brother.",
              },
              {
                name: "Rohan Verma",
                city: "Pune",
                review:
                  "Fast delivery, premium packaging and the quality is absolutely worth the price.",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-white border border-[#e4e2df] p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex gap-1 text-[#C9A96E]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-6 text-sm leading-8 text-[#7A6E63] italic">
                  "{item.review}"
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#eee8df] flex items-center justify-center text-[#1b1c1a] font-semibold">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="text-sm uppercase tracking-[0.15em] text-[#1b1c1a]">
                      {item.name}
                    </h4>

                    <p className="text-xs text-[#7A6E63]">{item.city}, India</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
