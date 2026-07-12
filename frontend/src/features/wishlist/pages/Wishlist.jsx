import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useWishlist } from "../hook/useWishlist";
import { useCart } from "../../cart/hook/useCart";
import toast from "react-hot-toast";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist);
  const { handleGetWishlist, handleRemoveWishlist } = useWishlist();
  const { handleAddItem } = useCart();

  useEffect(() => {
    handleGetWishlist();
  }, []);

  const getVariantDetails = (product, variantId) => {
    if (!product?.variants || !variantId) return null;

    return product.variants.find(
      (variant) => variant._id.toString() === variantId.toString(),
    );
  };

  const getDisplayImage = (product, variant) => {
    if (variant?.images?.length) return variant.images[0].url;
    if (product?.images?.length) return product.images[0].url;
    return "/placeholder.png";
  };

  const formatCurrency = (amount, currency = "INR") =>
    `${currency} ${Number(amount).toLocaleString("en-IN")}`;

  if (!wishlist?.items?.length) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center px-8">
        <div className="text-center">
          <h1
            className="text-5xl md:text-6xl font-light mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Your wishlist is empty.
          </h1>

          <p className="text-[10px] uppercase tracking-[0.22em] text-[#B5ADA3] mb-8">
            Save pieces you love
          </p>

          <Link
            to="/"
            className="inline-block px-10 py-4 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.25em]"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24 bg-[#fbf9f6]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
        <div className="mb-12">
          <h1
            className="font-light leading-[1.05] mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#1b1c1a",
              fontSize: "clamp(2.8rem, 5vw, 4rem)",
            }}
          >
            Saved Pieces
          </h1>

          <p className="text-[10px] uppercase tracking-[0.24em] text-[#B5ADA3]">
            {wishlist.items.length}{" "}
            {wishlist.items.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.items.map((item) => {
            const product = item.product;
            const variantId = item.variant;
            const variant = getVariantDetails(product, variantId);
            const imageUrl = getDisplayImage(product, variant);
            const price = variant?.price || product?.price;

            return (
              <div
                key={`${product._id}-${variantId}`}
                className="group bg-[#f5f3f0] p-5"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e4e2df] mb-5">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <button
                      onClick={async (e) => {
                        e.preventDefault();

                        try {
                          await handleRemoveWishlist({
                            productId: product._id,
                            variantId,
                          });

                          toast.success("Removed from wishlist");
                        } catch (err) {
                          toast.error(
                            err.response?.data?.message ||
                              "Failed to remove item",
                          );
                        }
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#C9A96E] hover:bg-[#1b1c1a] transition-all"
                    >
                      ♥
                    </button>
                  </div>
                </Link>

                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2
                      className="text-2xl font-light mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {product.title}
                    </h2>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#7A6E63]">
                      {variant?.color} {variant?.size && ` / ${variant.size}`}
                    </p>
                  </div>

                  <p className="text-[11px] uppercase tracking-[0.16em] font-medium">
                    {price ? formatCurrency(price.amount, price.currency) : "—"}
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={async () => {
                      try {
                        await handleAddItem({
                          productId: product._id,
                          variantId,
                        });

                        toast.success("Added to cart");
                      } catch (err) {
                        toast.error(
                          err.response?.data?.message ||
                            "Failed to add to cart",
                        );
                      }
                    }}
                    className="flex-1 py-3 bg-[#1b1c1a] text-[#fbf9f6] text-[10px] uppercase tracking-[0.2em] hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await handleRemoveWishlist({
                          productId: product._id,
                          variantId,
                        });

                        toast.success("Removed from wishlist");
                      } catch (err) {
                        toast.error(
                          err.response?.data?.message ||
                            "Failed to remove item",
                        );
                      }
                    }}
                    className="px-5 py-3 border border-[#d0c5b5] text-[10px] uppercase tracking-[0.2em] hover:border-[#1b1c1a] transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
