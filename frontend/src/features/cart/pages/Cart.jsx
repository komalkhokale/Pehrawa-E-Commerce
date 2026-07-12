import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import toast from "react-hot-toast";
import {useRazorpay } from "react-razorpay";

const tokens = {
  surface: "#fbf9f6",
  surfaceLow: "#f5f3f0",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#eae8e5",
  surfaceHighest: "#e4e2df",
  onSurface: "#1b1c1a",
  secondary: "#7A6E63",
  muted: "#B5ADA3",
  primary: "#C9A96E",
  outlineVariant: "#d0c5b5",
};

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const {error, isLoading, Razorpay} = useRazorpay();

  const {
    handleGetCart,
    handleIncrementCartItem,
    handleCreateCartOrder,
    handleVerifyCartOrder,
    handleDecrementCartItem,
    handleRemoveCartItem,
  } = useCart();

  useEffect(() => {
    handleGetCart();
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
    return null;
  };

  const formatCurrency = (amount, currency = "INR") =>
    `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;

const totalPrice = cart.totalPrice;


async function handleCheckout() {


  const order = await handleCreateCartOrder()
  
  

    const options = {
      key: "rzp_test_TBmnzPCpE5R4Dj",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Pehrawa",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async (response) => {
        try {
          const verificationData = await handleVerifyCartOrder({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          console.log("Verification response:", verificationData);
          console.log("Received backend order:", verificationData?.order);

          if (!verificationData?.order) {
            toast.error("Backend se order details nahi mili");
            return;
          }

          navigate(`/order-success?order_id=${response.razorpay_order_id}`, {
            state: {
              order: verificationData.order,
            },
          });
        } catch (error) {
          console.log("Payment verification error:", error);

          toast.error(
            error.response?.data?.message || "Payment verification failed",
          );
        }
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color: tokens.primary,
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

    console.log(order);

}

  if (!cart?.items?.length) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <p
          className="text-5xl md:text-6xl font-light leading-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: tokens.onSurface,
          }}
        >
          Your selection is empty.
        </p>

        <p
          className="mt-5 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: tokens.muted }}
        >
          Curate your collection
        </p>

        <Link
          to="/collection"
          className="mt-8 px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
          style={{
            backgroundColor: tokens.onSurface,
            color: tokens.surface,
          }}
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
      style={{
        backgroundColor: tokens.surface,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">
            Shopping Bag
          </p>

          <h1
            className="mt-4 text-5xl lg:text-6xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Your Selection
          </h1>

          <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#B5ADA3]">
            {cart.items.length} {cart.items.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div className="w-full lg:w-[65%]">
            <div className="flex flex-col gap-5">
              {cart.items.map((item) => {
                const product = item.product;
                const variant = item.variant;

                const imageUrl =
                  variant?.images?.[0]?.url || product?.images?.[0]?.url;

                const displayPrice = item.cartPrice;
                const variantPrice = item.variant?.price;

                const qty = item.quantity ?? 1;
                const stock = variant?.stock;

                return (
                  <div
                    key={`${product?._id}-${variant?._id}`}
                    className="group flex gap-5 md:gap-7 bg-[#f5f3f0] p-5 md:p-6 transition-all duration-300 hover:bg-white hover:shadow-[0_18px_45px_rgba(0,0,0,0.05)]"
                  >
                    <div className="w-[110px] md:w-[150px] shrink-0 aspect-[4/5] overflow-hidden bg-[#e4e2df]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product?.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
                              {product?.category}
                            </p>

                            <h2
                              className="mt-2 text-2xl md:text-3xl font-light leading-tight text-[#1b1c1a]"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                              }}
                            >
                              {product?.title}
                            </h2>
                          </div>

                          <p className="shrink-0 text-[12px] uppercase tracking-[0.14em] font-medium text-[#1b1c1a]">
                            {formatCurrency(
                              displayPrice?.amount,
                              displayPrice?.currency,
                            )}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {variant?.color && (
                            <span className="border border-[#e4e2df] bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#7A6E63]">
                              {variant.color}
                            </span>
                          )}

                          {variant?.size && (
                            <span className="border border-[#e4e2df] bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#7A6E63]">
                              Size {variant.size}
                            </span>
                          )}
                        </div>

                        {stock !== undefined && (
                          <p
                            className={`mt-4 text-[10px] uppercase tracking-[0.16em] ${
                              stock > 0 ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {stock > 0 ? `${stock} in stock` : "Out of stock"}
                          </p>
                        )}

                        {displayPrice &&
                          variantPrice &&
                          displayPrice.amount !== variantPrice.amount && (
                            <>
                              {displayPrice.amount > variantPrice.amount ? (
                                <p className="text-[12px] uppercase tracking-[0.15em] mt-4 text-green-600 font-bold">
                                  You will save{" "}
                                  {formatCurrency(
                                    displayPrice.amount - variantPrice.amount,
                                    variantPrice.currency,
                                  )}
                                  . You will get this at{" "}
                                  {formatCurrency(
                                    variantPrice.amount,
                                    variantPrice.currency,
                                  )}
                                </p>
                              ) : (
                                <p className="text-[12px] uppercase tracking-[0.15em] mt-4 text-red-600 font-bold">
                                  Warning: this product will cost you{" "}
                                  {formatCurrency(
                                    variantPrice.amount - displayPrice.amount,
                                    variantPrice.currency,
                                  )}{" "}
                                  more.
                                </p>
                              )}
                            </>
                          )}
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <div className="flex items-center border border-[#d0c5b5] bg-white">
                          <button
                            onClick={() =>
                              handleDecrementCartItem({
                                productId: product._id,
                                variantId: variant._id,
                              })
                            }
                            className="h-10 w-10 text-lg text-[#1b1c1a] hover:bg-[#f5f3f0]"
                          >
                            −
                          </button>

                          <span className="w-10 text-center text-[12px] font-medium text-[#1b1c1a]">
                            {qty}
                          </span>

                          <button
                            onClick={async () => {
                              try {
                                await handleIncrementCartItem({
                                  productId: product._id,
                                  variantId: variant._id,
                                });
                              } catch (err) {
                                toast.error(
                                  err.response?.data?.message ||
                                    "Failed to update quantity",
                                );
                              }
                            }}
                            className="h-10 w-10 text-lg text-[#1b1c1a] hover:bg-[#f5f3f0]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={async () => {
                            try {
                              await handleRemoveCartItem({
                                productId: product._id,
                                variantId: variant._id,
                              });

                              toast.success("Item removed from cart");
                            } catch (err) {
                              toast.error(
                                err.response?.data?.message ||
                                  "Failed to remove item",
                              );
                            }
                          }}
                          className="text-[10px] uppercase tracking-[0.22em] text-[#B5ADA3] hover:text-[#1b1c1a]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#e4e2df] pt-8">
              {[
                ["Shipping", "Free shipping above INR 999"],
                ["Returns", "Easy returns within 7 days"],
                ["Authenticity", "100% quality checked"],
              ].map(([title, desc]) => (
                <div key={title}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">
                    {title}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-[#B5ADA3]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[35%] lg:sticky lg:top-28">
            <div className="bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <h2
                className="text-3xl font-light text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Order Summary
              </h2>

              <div className="my-6 h-px bg-[#e4e2df]" />

              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">
                    Subtotal
                  </span>
                  <span className="text-[12px] font-medium text-[#1b1c1a]">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">
                    Shipping
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-green-700">
                    {totalPrice >= 999 ? "Free" : "Free above INR 999"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">
                    Taxes
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#B5ADA3]">
                    Included
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-[#e4e2df]" />

              <div className="mb-8 flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#1b1c1a]">
                  Total
                </span>
                <span className="text-lg font-medium text-[#1b1c1a]">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#1b1c1a] py-4 text-[11px] uppercase tracking-[0.25em] text-[#fbf9f6] transition hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
              >
                Proceed to Checkout
               </button>

              <button
                onClick={() => navigate("/collection")}
                className="mt-3 w-full border border-[#d0c5b5] py-4 text-[11px] uppercase tracking-[0.25em] text-[#1b1c1a] transition hover:border-[#C9A96E]"
              >
                Continue Shopping
              </button>

              <p className="mt-6 text-center text-[9px] uppercase tracking-[0.14em] leading-relaxed text-[#B5ADA3]">
                Secure checkout · Easy returns · Quality guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
