import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useState } from "react";

const ProductSection = () => {

  const products = useSelector((state) => state.product.products);
  const navigate = useNavigate();

  const { handleGetAllProducts } = useProduct();

  const categories = [
    "All",
    "T-Shirt",
    "Shirt",
    "Jeans",
    "Pant",
    "Cargo",
    "Hoodie",
    "Sweatshirt",
    "Jacket",
    "Kurta",
    "Dress",
    "Top",
    "Skirt",
    "Saree",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  console.log("products from redux:", products);

  return (
    <section className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-32">
      <section className="mb-16">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`snap-start whitespace-nowrap border px-6 py-3 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#1b1c1a] text-white border-[#1b1c1a]"
                  : "bg-[#FBF9F6] text-[#1b1c1a] border-[#e4e2df] hover:border-[#C9A96E] hover:text-[#C9A96E]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {products?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.slice(0, 8).map((product) => {
              const firstVariant = product.variants?.[0];

              const imageUrl =
                firstVariant?.images?.[0]?.url || product.images?.[0]?.url;

              return (
                <article
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f1ee]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[#7A6E63]">
                        No Image
                      </div>
                    )}

                    <button className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#1b1c1a] py-3 text-[10px] uppercase tracking-[0.22em] text-white transition-transform duration-300 group-hover:translate-y-0">
                      View Product
                    </button>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#9b8a78]">
                          {product.category}
                        </p>

                        <h3 className="mt-1 text-[14px] font-medium uppercase tracking-[0.08em] text-[#1b1c1a]">
                          {product.title}
                        </h3>
                      </div>

                      <p className="shrink-0 text-[13px] font-semibold text-[#1b1c1a]">
                        ₹{firstVariant?.price?.amount?.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-[11px] text-[#7A6E63]">
                        {firstVariant?.color} / {firstVariant?.size}
                      </p>

                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#7A6E63]">
                        {firstVariant?.stock > 0 ? "In stock" : "Sold out"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length > 8 && (
            <div className="relative left-1/2 -translate-x-1/2 mt-20 pb-20 w-fit">
              <button
                onClick={() => navigate("/collection")}
                className="group flex items-center gap-4 border border-[#1b1c1a] px-10 py-4 text-[10px] uppercase tracking-[0.28em] text-[#1b1c1a] transition hover:bg-[#1b1c1a] hover:text-white"
              >
                View All Products
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-24 text-center">
          <h2
            className="text-4xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            No products found
          </h2>
        </div>
      )}
    </section>
  );
  
};

export default ProductSection;
