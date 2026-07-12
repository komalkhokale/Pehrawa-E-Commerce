import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CreditCard,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";

const tokens = {
  surface: "#fbf9f6",
  surfaceLow: "#f5f3f0",
  surfaceHigh: "#eae8e5",
  white: "#ffffff",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#4d463a",
  secondary: "#7a6e63",
  muted: "#b5ada3",
  primary: "#c9a96e",
  primaryDark: "#745a27",
  outlineVariant: "#d0c5b5",
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { handleGetMyOrders } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await handleGetMyOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to fetch your orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getImageUrl = (images) => {
    if (!images?.length) return null;

    if (typeof images[0] === "string") {
      return images[0];
    }

    return images[0]?.url || null;
  };

  const getTotalItems = (orderItems = []) => {
    return orderItems.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0,
    );
  };

  if (loading) {
    return (
      <div
        className="min-h-[75vh] flex flex-col items-center justify-center px-6"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
          style={{
            borderColor: tokens.primary,
            borderTopColor: "transparent",
          }}
        />

        <p
          className="mt-5 text-[10px] uppercase tracking-[0.28em]"
          style={{ color: tokens.secondary }}
        >
          Loading your orders
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <RefreshCw
          size={34}
          strokeWidth={1.2}
          style={{ color: tokens.primaryDark }}
        />

        <h1
          className="mt-5 text-5xl font-light"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: tokens.onSurface,
          }}
        >
          Unable to load orders
        </h1>

        <p
          className="mt-4 max-w-md text-sm leading-6"
          style={{ color: tokens.secondary }}
        >
          {error}
        </p>

        <button
          onClick={fetchOrders}
          className="mt-8 px-9 py-4 text-[10px] uppercase tracking-[0.24em] transition-opacity hover:opacity-80"
          style={{
            backgroundColor: tokens.onSurface,
            color: tokens.surface,
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div
        className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: tokens.surfaceHigh }}
        >
          <ShoppingBag
            size={25}
            strokeWidth={1.3}
            style={{ color: tokens.onSurface }}
          />
        </div>

        <p
          className="mt-7 text-[10px] uppercase tracking-[0.28em]"
          style={{ color: tokens.primaryDark }}
        >
          Purchase History
        </p>

        <h1
          className="mt-4 text-5xl md:text-6xl font-light"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: tokens.onSurface,
          }}
        >
          No orders yet
        </h1>

        <p className="mt-4 text-sm" style={{ color: tokens.secondary }}>
          Your completed orders will appear here.
        </p>

        <Link
          to="/collection"
          className="mt-8 px-10 py-4 text-[10px] uppercase tracking-[0.24em] transition-opacity hover:opacity-80"
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
      className="min-h-screen pb-24"
      style={{
        backgroundColor: tokens.surface,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <main className="mx-auto max-w-6xl px-5 md:px-10 lg:px-12">

        {/* Heading */}
        <div
          className="mt-12 flex flex-col gap-6 pb-9 md:flex-row md:items-end md:justify-between"
          style={{
            borderBottom: `1px solid ${tokens.outlineVariant}`,
          }}
        >
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: tokens.primaryDark }}
            >
              Account / Purchase History
            </p>

            <h1
              className="mt-3 text-5xl font-light md:text-6xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: tokens.onSurface,
              }}
            >
              My Orders
            </h1>

            <p className="mt-3 text-sm" style={{ color: tokens.secondary }}>
              Review your completed purchases and payment details.
            </p>
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: tokens.muted }}
          >
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        {/* Orders list */}
        <div className="mt-10 space-y-8">
          {orders.map((order) => {
            const totalItems = getTotalItems(order.orderItems);

            return (
              <article
                key={order._id}
                className="overflow-hidden bg-white shadow-[0_18px_55px_rgba(0,0,0,0.035)]"
                style={{
                  border: `1px solid ${tokens.outlineVariant}`,
                }}
              >
                {/* Order header */}
                <div
                  className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7"
                  style={{
                    backgroundColor: tokens.surfaceLow,
                    borderBottom: `1px solid ${tokens.outlineVariant}`,
                  }}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
                    <div className="flex items-start gap-3">
                      <Package
                        size={17}
                        strokeWidth={1.4}
                        style={{ color: tokens.primaryDark }}
                      />

                      <div>
                        <p
                          className="text-[8px] uppercase tracking-[0.22em]"
                          style={{ color: tokens.muted }}
                        >
                          Order Reference
                        </p>

                        <p
                          className="mt-1 max-w-[250px] truncate text-xs"
                          title={order.razorpay?.orderId}
                          style={{ color: tokens.onSurface }}
                        >
                          {order.razorpay?.orderId || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={17}
                        strokeWidth={1.4}
                        style={{ color: tokens.primaryDark }}
                      />

                      <div>
                        <p
                          className="text-[8px] uppercase tracking-[0.22em]"
                          style={{ color: tokens.muted }}
                        >
                          Ordered On
                        </p>

                        <p
                          className="mt-1 text-xs"
                          style={{ color: tokens.onSurface }}
                        >
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex w-fit items-center gap-2 px-4 py-2 text-[8px] uppercase tracking-[0.2em]"
                    style={{
                      backgroundColor: "#edf7ef",
                      color: "#277436",
                    }}
                  >
                    <Check size={13} strokeWidth={1.8} />
                    Payment Confirmed
                  </div>
                </div>

                {/* Products */}
                <div className="px-5 py-6 md:px-7 md:py-7">
                  <div className="space-y-6">
                    {order.orderItems?.map((item, index) => {
                      const imageUrl = getImageUrl(item.images);

                      const lineTotal =
                        Number(item.price?.amount || 0) *
                        Number(item.quantity || 1);

                      return (
                        <div
                          key={
                            item._id ||
                            `${item.productId}-${item.variantId}-${index}`
                          }
                          className="grid grid-cols-[82px_1fr] gap-4 border-b pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[96px_1fr_auto] sm:gap-6"
                          style={{
                            borderColor: tokens.surfaceHigh,
                          }}
                        >
                          {/* Product image */}
                          <div
                            className="h-[112px] w-[82px] overflow-hidden sm:h-[128px] sm:w-[96px]"
                            style={{
                              backgroundColor: tokens.surfaceHigh,
                            }}
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.title || "Ordered product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div
                                className="flex h-full w-full items-center justify-center text-[8px] uppercase tracking-[0.18em]"
                                style={{ color: tokens.muted }}
                              >
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Product details */}
                          <div className="min-w-0">
                            <h2
                              className="text-xl leading-tight md:text-2xl"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: tokens.onSurface,
                              }}
                            >
                              {item.title || "Product"}
                            </h2>

                            <p
                              className="mt-2 text-[9px] uppercase tracking-[0.18em]"
                              style={{ color: tokens.secondary }}
                            >
                              Quantity: {item.quantity || 1}
                            </p>

                            {item.description && (
                              <p
                                className="mt-3 max-w-2xl text-xs leading-5 line-clamp-2 md:text-sm md:leading-6"
                                style={{
                                  color: tokens.onSurfaceVariant,
                                }}
                              >
                                {item.description}
                              </p>
                            )}

                            <p
                              className="mt-4 text-sm font-medium sm:hidden"
                              style={{ color: tokens.primaryDark }}
                            >
                              {formatCurrency(
                                lineTotal,
                                item.price?.currency || order.price?.currency,
                              )}
                            </p>
                          </div>

                          {/* Product total */}
                          <div className="hidden text-right sm:block">
                            <p
                              className="text-[8px] uppercase tracking-[0.18em]"
                              style={{ color: tokens.muted }}
                            >
                              Item Total
                            </p>

                            <p
                              className="mt-2 text-base font-medium"
                              style={{ color: tokens.primaryDark }}
                            >
                              {formatCurrency(
                                lineTotal,
                                item.price?.currency || order.price?.currency,
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Compact summary */}
                  <div
                    className="mt-7 grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-[120px_1fr_180px]"
                    style={{
                      borderTop: `1px solid ${tokens.outlineVariant}`,
                    }}
                  >
                    <div>
                      <p
                        className="text-[8px] uppercase tracking-[0.2em]"
                        style={{ color: tokens.muted }}
                      >
                        Total Items
                      </p>

                      <p
                        className="mt-2 text-sm"
                        style={{ color: tokens.onSurface }}
                      >
                        {totalItems}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard
                          size={14}
                          strokeWidth={1.4}
                          style={{ color: tokens.primaryDark }}
                        />

                        <p
                          className="text-[8px] uppercase tracking-[0.2em]"
                          style={{ color: tokens.muted }}
                        >
                          Payment ID
                        </p>
                      </div>

                      <p
                        className="mt-2 break-all text-xs"
                        style={{ color: tokens.onSurfaceVariant }}
                      >
                        {order.razorpay?.paymentId || "Not available"}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p
                        className="text-[8px] uppercase tracking-[0.2em]"
                        style={{ color: tokens.muted }}
                      >
                        Total Paid
                      </p>

                      <p
                        className="mt-1 text-3xl"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          color: tokens.primaryDark,
                        }}
                      >
                        {formatCurrency(
                          order.price?.amount,
                          order.price?.currency,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bottom actions */}
                  <div
                    className="mt-6 flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between"
                    style={{
                      borderTop: `1px solid ${tokens.surfaceHigh}`,
                    }}
                  >
                    <p
                      className="text-[9px] uppercase tracking-[0.18em]"
                      style={{ color: tokens.muted }}
                    >
                      Payment completed successfully
                    </p>

                    <Link
                      to="/collection"
                      className="w-full px-8 py-3 text-center text-[9px] uppercase tracking-[0.22em] transition-opacity hover:opacity-80 sm:w-auto"
                      style={{
                        backgroundColor: tokens.onSurface,
                        color: tokens.surface,
                      }}
                    >
                      Shop Again
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
