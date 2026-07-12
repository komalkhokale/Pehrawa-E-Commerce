import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";

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

const sizes = ["All", "XS", "S", "M", "L", "XL", "XXL"];

const Collection = () => {
  const products = useSelector((state) => state.product.products || []);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const genderFromUrl = searchParams.get("gender") || "All";

  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState(genderFromUrl);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sort, setSort] = useState("newest");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  useEffect(() => {
    setSelectedGender(genderFromUrl);
  }, [genderFromUrl]);

  const changeGender = (value) => {
    setSelectedGender(value);

    if (value === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ gender: value });
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchSearch =
        product.title?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase()) ||
        product.gender?.toLowerCase().includes(search.toLowerCase());

      const matchGender =
        selectedGender === "All" ? true : product.gender === selectedGender;

      const matchCategory =
        selectedCategory === "All"
          ? true
          : product.category === selectedCategory;

      const matchSize =
        selectedSize === "All"
          ? true
          : product.variants?.some((v) => v.size === selectedSize);

      return matchSearch && matchGender && matchCategory && matchSize;
    });

    if (sort === "low-high") {
      result = [...result].sort(
        (a, b) =>
          (a.variants?.[0]?.price?.amount || 0) -
          (b.variants?.[0]?.price?.amount || 0),
      );
    }

    if (sort === "high-low") {
      result = [...result].sort(
        (a, b) =>
          (b.variants?.[0]?.price?.amount || 0) -
          (a.variants?.[0]?.price?.amount || 0),
      );
    }

    return result;
  }, [products, search, selectedGender, selectedCategory, selectedSize, sort]);

  const FilterContent = () => (
    <div className=" border border-[#e4e2df] bg-white/70 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-[0.28em] text-[#1b1c1a]">
          Filters
        </h3>

        <button
          onClick={() => {
            changeGender("All");
            setSelectedCategory("All");
            setSelectedSize("All");
            setSearch("");
            setSort("newest");
          }}
          className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]"
        >
          Reset
        </button>
      </div>

      <div className="border-t border-[#eee7df] py-6">
        <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#9b8a78]">
          Gender
        </p>

        <div className="grid grid-cols-2 gap-2">
          {["All", "Men", "Women", "Unisex"].map((item) => (
            <button
              key={item}
              onClick={() => changeGender(item)}
              className={`border px-4 py-3 text-[11px] uppercase tracking-[0.16em] transition ${
                selectedGender === item
                  ? "border-[#1b1c1a] bg-[#1b1c1a] text-white"
                  : "border-[#e4e2df] bg-[#fbf9f6] text-[#7A6E63] hover:border-[#C9A96E]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#eee7df] py-6">
        <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#9b8a78]">
          Category
        </p>

        <div className="max-h-[260px] space-y-2 overflow-y-auto hide-scrollbar pr-1">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition ${
                selectedCategory === item
                  ? "bg-[#1b1c1a] text-white"
                  : "text-[#7A6E63] hover:bg-[#f3eee8] hover:text-[#1b1c1a]"
              }`}
            >
              <span>{item}</span>
              {selectedCategory === item && (
                <span className="h-1.5 w-1.5 bg-[#C9A96E]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#eee7df] pt-6">
        <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#9b8a78]">
          Size
        </p>

        <div className="grid grid-cols-3 gap-2">
          {sizes.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedSize(item)}
              className={`border py-3 text-xs uppercase tracking-[0.15em] transition ${
                selectedSize === item
                  ? "border-[#1b1c1a] bg-[#1b1c1a] text-white"
                  : "border-[#e4e2df] bg-[#fbf9f6] text-[#7A6E63] hover:border-[#C9A96E]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fbf9f6] px-6 py-10 lg:px-20">
      <div className="mb-10 flex justify-between">
        <div className=" flex flex-col flex-start">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
            Pehrawa Collection
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Explore The Archive
          </h1>
        </div>

        <div className="mt-8 flex w-full max-w-xl items-center border border-[#d8d1c8] bg-white px-5">
          <Search size={18} className="text-[#7A6E63]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-4 py-4 text-sm outline-none placeholder:text-[#9b8f84]"
          />
        </div>
      </div>

      <div className="sticky top-0 z-30 mb-8 flex items-center justify-between border-y border-[#e4e2df] bg-[#fbf9f6]/95 py-5 backdrop-blur">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#1b1c1a] lg:hidden"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        <p className="text-[10px] uppercase tracking-[0.25em] text-[#7A6E63]">
          {filteredProducts.length} Products
        </p>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-transparent text-[10px] uppercase tracking-[0.2em] text-[#1b1c1a] outline-none"
        >
          <option value="newest">Newest</option>
          <option value="low-high">Price Low to High</option>
          <option value="high-low">Price High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar">
          <FilterContent />
        </aside>

        <section className="lg:h-[calc(100vh-8rem)] lg:overflow-y-auto hide-scrollbar pr-1">
          {filteredProducts?.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4 pb-24">
              {filteredProducts.map((product) => {
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

                      <p className="mt-2 text-[11px] text-[#7A6E63]">
                        {firstVariant?.color} / {firstVariant?.size}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
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
      </div>

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="h-full w-[85%] max-w-sm overflow-y-auto bg-[#fbf9f6] p-7">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-[0.3em]">
                Filters
              </h2>

              <button onClick={() => setShowMobileFilter(false)}>
                <X size={20} />
              </button>
            </div>

            <FilterContent />
          </div>
        </div>
      )}
    </main>
  );
};

export default Collection;
