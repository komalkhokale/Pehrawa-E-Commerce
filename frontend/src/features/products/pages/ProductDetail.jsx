import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useCart } from "../../cart/hook/useCart";
import { useWishlist } from "../../wishlist/hook/useWishlist";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ReviewSection from "../components/ReviewSection.jsx";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  const { handleAddItem } = useCart();
const { handleAddWishlist, handleGetWishlist, handleRemoveWishlist } =
  useWishlist();

  const wishlistItems = useSelector((state) => state.wishlist.items || []); 

  const allProducts = useSelector((state) => state.product.products || []);

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      // Handle both cases depending on how API is structured
      setProduct(data?.product || data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

 useEffect(() => {
   if (product?.variants?.length > 0) {
     setSelectedAttributes({
       color: product.variants[0].color,
       size: product.variants[0].size,
     });
   }
 }, [product]);

 const activeVariant = useMemo(() => {
   if (!product?.variants) return null;

   return (
     product.variants.find(
       (v) =>
         v.color === selectedAttributes.color &&
         v.size === selectedAttributes.size,
     ) || product.variants[0]
   );
 }, [product, selectedAttributes]);

const isWishlisted =
  product &&
  activeVariant &&
  wishlistItems.some(
    (item) =>
      item.product?._id === product._id && item.variant === activeVariant._id,
  );;

  console.log({ product, activeVariant });

const colors = [...new Set(product?.variants?.map((v) => v.color))];

const sizes = [...new Set(product?.variants?.map((v) => v.size))];

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariant]);

  useEffect(() => {
  handleGetWishlist();
}, []);
 

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center selection:bg-[#C9A96E]/30"
        style={{ backgroundColor: "#fbf9f6" }}
      >
        <p
          style={{ fontFamily: "'Inter', sans-serif", color: "#B5ADA3" }}
          className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse"
        >
          Retrieving piece...
        </p>
      </div>
    );
  }

  console.log(product);

  // Fallbacks
  const displayImages =
    activeVariant?.images?.length > 0
      ? activeVariant.images
      : [{ url: "/placeholder.png" }];

  const displayPrice = activeVariant?.price?.amount
    ? activeVariant.price
    : product.price;

 const sameCategory = allProducts.filter(
   (item) => item._id !== product._id && item.category === product.category,
 );

 const otherProducts = allProducts.filter(
   (item) => item._id !== product._id && item.category !== product.category,
 );

 const relatedProducts = [...sameCategory, ...otherProducts].slice(0, 4);

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            {/* ── LEFT: Image Gallery ── */}
            <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
              {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
              {displayImages.length > 1 && (
                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-200px)]">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${selectedImage === idx ? "opacity-100 ring-1 ring-[#C9A96E] ring-offset-2" : "opacity-50 hover:opacity-100"}`}
                      style={{
                        backgroundColor: "#f5f3f0",
                        "--tw-ring-offset-color": "#fbf9f6",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div
                className="relative w-full aspect-[4/5] overflow-hidden group"
                style={{ backgroundColor: "#f5f3f0" }}
              >
                <img
                  src={
                    displayImages[selectedImage]?.url || displayImages[0].url
                  }
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                {/* Wishlist Button */}
                <button
                  onClick={async () => {
                    try {
                      if (isWishlisted) {
                        await handleRemoveWishlist({
                          productId: product._id,
                          variantId: activeVariant._id,
                        });

                        toast.success("Removed from wishlist");
                      } else {
                        await handleAddWishlist({
                          productId: product._id,
                          variantId: activeVariant._id,
                        });

                        toast.success("Added to wishlist");
                      }
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message || "Something went wrong",
                      );
                    }
                  }}
                  className="absolute top-5 right-5 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? "#C9A96E" : "none"}
                    stroke={isWishlisted ? "#C9A96E" : "#1b1c1a"}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? displayImages.length - 1 : prev - 1,
                        )
                      }
                      className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                      style={{
                        backgroundColor: "rgba(251,249,246,0.8)",
                        borderColor: "#e4e2df",
                        color: "#1b1c1a",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fbf9f6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(251,249,246,0.8)")
                      }
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === displayImages.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                      style={{
                        backgroundColor: "rgba(251,249,246,0.8)",
                        borderColor: "#e4e2df",
                        color: "#1b1c1a",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fbf9f6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(251,249,246,0.8)")
                      }
                      aria-label="Next image"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── RIGHT: Product Details ── */}
            <div className="w-full lg:w-[30%] lg:sticky lg:top-24 flex flex-col pt-4">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1b1c1a",
                }}
              >
                {product.title}
              </h1>

              <div className="mb-8">
                <span
                  className="text-sm uppercase tracking-[0.2em] font-medium"
                  style={{ color: "#1b1c1a" }}
                >
                  {displayPrice?.currency}{" "}
                  {displayPrice?.amount?.toLocaleString()}
                </span>
              </div>

              <div
                className="h-px w-full mb-8"
                style={{ backgroundColor: "#e4e2df" }}
              />

              {/* COLOR */}

              <div className="mb-6">
                <h3
                  className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3"
                  style={{ color: "#C9A96E" }}
                >
                  Color
                </h3>

                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const variant =
                          product.variants.find(
                            (v) =>
                              v.color === color &&
                              v.size === selectedAttributes.size,
                          ) || product.variants.find((v) => v.color === color);

                        setSelectedAttributes({
                          color: variant.color,
                          size: variant.size,
                        });
                      }}
                      className={`px-4 py-2 border transition-all ${
                        activeVariant?.color === color
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZE */}

              <div className="mb-6">
                <h3
                  className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3"
                  style={{ color: "#C9A96E" }}
                >
                  Size
                </h3>

                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const variant =
                          product.variants.find(
                            (v) =>
                              v.size === size &&
                              v.color === selectedAttributes.color,
                          ) || product.variants.find((v) => v.size === size);

                        setSelectedAttributes({
                          color: variant.color,
                          size: variant.size,
                        });
                      }}
                      className={`px-4 py-2 border transition-all ${
                        activeVariant?.size === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Information */}
              {activeVariant && activeVariant.stock !== undefined && (
                <div className="mb-6">
                  <span
                    className={`text-[10px] uppercase tracking-[0.2em] font-medium ${activeVariant.stock > 0 ? "text-green-700" : "text-red-700"}`}
                  >
                    {activeVariant.stock > 0
                      ? `${activeVariant.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              )}

              <div className="mb-12">
                <h3
                  className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4"
                  style={{ color: "#C9A96E" }}
                >
                  The Details
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#7A6E63" }}
                >
                  {product.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mt-auto">
                <button
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                  style={{
                    backgroundColor: "#1b1c1a",
                    color: "#fbf9f6",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#C9A96E";
                    e.currentTarget.style.color = "#1b1c1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1b1c1a";
                    e.currentTarget.style.color = "#fbf9f6";
                  }}
                  onClick={async () => {
                    try {
                      await handleAddItem({
                        productId: product._id,
                        variantId: activeVariant._id,
                      });

                      toast.success("Added to cart");
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message || "Unable to add to cart",
                      );
                    }
                  }}
                >
                  Add to Cart
                </button>

                <button
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#d0c5b5",
                    color: "#1b1c1a",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#C9A96E";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d0c5b5";
                  }}
                  onClick={async () => {
                    try {
                      await handleAddItem({
                        productId: product._id,
                        variantId: activeVariant._id,
                      });

                      navigate("/cart");
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message || "Unable to continue",
                      );
                    }
                  }}
                >
                  Buy Now
                </button>
              </div>

              {/* Extra elegant details */}
              <div
                className="mt-14 space-y-4 text-[10px] uppercase tracking-[0.1em]"
                style={{ color: "#B5ADA3" }}
              >
                <div
                  className="flex justify-between border-b pb-3"
                  style={{ borderColor: "#e4e2df" }}
                >
                  <span>Shipping</span>
                  <span>Complimentary over INR 15,000</span>
                </div>
                <div
                  className="flex justify-between border-b pb-3"
                  style={{ borderColor: "#e4e2df" }}
                >
                  <span>Returns</span>
                  <span>Within 14 days of delivery</span>
                </div>
                <div
                  className="flex justify-between border-b pb-3"
                  style={{ borderColor: "#e4e2df" }}
                >
                  <span>Authenticity</span>
                  <span>100% Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection productId={product._id} />

      <section className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 mt-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E]">
              You May Also Like
            </p>

            <h2
              className="mt-3 text-5xl font-light text-[#1b1c1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Related Products
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((item) => {
            const variant = item.variants?.[0];

            return (
              <article
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#f5f3f0]">
                  <img
                    src={variant?.images?.[0]?.url || item.images?.[0]?.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9b8a78]">
                    {item.category}
                  </p>

                  <h3 className="mt-2 text-sm uppercase tracking-[0.08em] text-[#1b1c1a]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold">
                    ₹{variant?.price?.amount}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
