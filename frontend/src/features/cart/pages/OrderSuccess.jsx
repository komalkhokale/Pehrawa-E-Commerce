import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const tokens = {
  surface: "#fbf9f6",
  surfaceLow: "#f5f3f0",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#eae8e5",
  surfaceHighest: "#e4e2df",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#4d463a",
  secondary: "#7A6E63",
  muted: "#B5ADA3",
  primary: "#C9A96E",
  primaryDark: "#745a27",
  outlineVariant: "#d0c5b5",
  outline: "#7f7668",
};

const OrderSuccess = () => {
 const location = useLocation();

 console.log("Location state:", location.state);
 console.log("Received order:", location.state?.order);

  const user = useSelector((state) => state.auth.user);

  const queryParams = new URLSearchParams(location.search);
  const queryOrderId = queryParams.get("order_id");

  const order = location.state?.order;

  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const getImageUrl = (images) => {
    if (!images?.length) return null;

    if (typeof images[0] === "string") {
      return images[0];
    }

    return images[0]?.url || null;
  };

  const formatDate = (date) => {
    if (!date) return "Today";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: tokens.primaryDark }}
        >
          Payment Completed
        </p>

        <h1
          className="mt-5 text-5xl md:text-6xl font-light"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: tokens.onSurface,
          }}
        >
          Order details unavailable
        </h1>

        <p
          className="mt-4 max-w-md text-sm leading-6"
          style={{ color: tokens.secondary }}
        >
          Your payment may have completed successfully, but the order details
          are not available on this page.
        </p>

        {queryOrderId && (
          <div
            className="mt-6 px-6 py-4"
            style={{ backgroundColor: tokens.surfaceLow }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: tokens.muted }}
            >
              Razorpay Order ID
            </p>

            <p
              className="mt-2 break-all text-sm"
              style={{ color: tokens.primaryDark }}
            >
              {queryOrderId}
            </p>
          </div>
        )}

        <Link
          to="/collection"
          className="mt-8 px-10 py-4 text-[11px] uppercase tracking-[0.22em]"
          style={{
            backgroundColor: tokens.onSurface,
            color: tokens.surface,
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const orderItems = order?.orderItems || [];

  const totalAmount = order?.price?.amount || 0;
  const currency = order?.price?.currency || "INR";

  const orderId =
    order?.razorpay?.orderId || queryOrderId || order?._id || "Not available";

  const paymentId = order?.razorpay?.paymentId || "Not available";

  const orderStatus = order?.status || "paid";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <main className="pt-12 lg:pt-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-12">
              <section className="space-y-6">
                <span
                  className="uppercase tracking-[0.25em] text-[10px]"
                  style={{ color: tokens.secondary }}
                >
                  Payment Successful
                </span>

                <h1
                  className="text-5xl md:text-7xl leading-tight font-light tracking-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: tokens.onSurface,
                  }}
                >
                  Thank you for <br />
                  <i className="italic">your order.</i>
                </h1>

                <p
                  className="max-w-xl text-sm leading-7"
                  style={{ color: tokens.onSurfaceVariant }}
                >
                  Your payment has been verified successfully. Your order has
                  been confirmed.
                </p>

                <div className="space-y-2 mt-6">
                  <p
                    className="text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: tokens.outline }}
                  >
                    Order Reference
                  </p>

                  <p
                    className="text-lg md:text-xl break-all"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: tokens.primaryDark,
                    }}
                  >
                    {orderId}
                  </p>

                  <p
                    className="text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: tokens.muted }}
                  >
                    Ordered on {formatDate(order?.createdAt)}
                  </p>
                </div>
              </section>

              {/* Order Summary */}
              <section
                className="p-6 md:p-10 space-y-8"
                style={{ backgroundColor: tokens.surfaceLow }}
              >
                <h3
                  className="text-2xl pb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: tokens.onSurface,
                    borderBottom: `1px solid ${tokens.outlineVariant}`,
                  }}
                >
                  Order Summary
                </h3>

                {orderItems.length > 0 ? (
                  <div className="space-y-7">
                    {orderItems.map((item, index) => {
                      const imageUrl = getImageUrl(item?.images);

                      return (
                        <div
                          key={
                            item?._id ||
                            `${item?.productId}-${item?.variantId}-${index}`
                          }
                          className="flex gap-5 items-start"
                        >
                          <div
                            className="w-24 h-32 md:w-28 md:h-36 flex-shrink-0 overflow-hidden"
                            style={{ backgroundColor: tokens.surfaceHigh }}
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item?.title || "Ordered product"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.18em]"
                                style={{ color: tokens.muted }}
                              >
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <h4
                              className="text-xl md:text-2xl"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: tokens.onSurface,
                              }}
                            >
                              {item?.title || "Product"}
                            </h4>

                            <p
                              className="mt-2 text-[10px] uppercase tracking-[0.18em]"
                              style={{ color: tokens.outline }}
                            >
                              Quantity: {item?.quantity || 1}
                            </p>

                            {item?.description && (
                              <p
                                className="mt-3 text-sm leading-6 line-clamp-2"
                                style={{
                                  color: tokens.onSurfaceVariant,
                                }}
                              >
                                {item.description}
                              </p>
                            )}

                            <p
                              className="mt-4 text-sm font-medium"
                              style={{ color: tokens.onSurface }}
                            >
                              {formatCurrency(
                                item?.price?.amount,
                                item?.price?.currency || currency,
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: tokens.secondary }}>
                    No order items found.
                  </p>
                )}

                <div
                  className="space-y-4 pt-6"
                  style={{
                    borderTop: `1px solid ${tokens.outlineVariant}`,
                  }}
                >
                  <div
                    className="flex justify-between text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: tokens.secondary }}
                  >
                    <span>Subtotal</span>

                    <span>{formatCurrency(totalAmount, currency)}</span>
                  </div>

                  <div
                    className="flex justify-between text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: tokens.secondary }}
                  >
                    <span>Payment Status</span>

                    <span style={{ color: "#277436" }}>
                      {orderStatus === "paid" ? "Paid" : orderStatus}
                    </span>
                  </div>

                  <div
                    className="flex justify-between text-xl pt-3"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: tokens.onSurface,
                    }}
                  >
                    <span>Total</span>

                    <span style={{ color: tokens.primaryDark }}>
                      {formatCurrency(totalAmount, currency)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12 mt-8 lg:mt-0">
              <div className="space-y-10">
                {/* Payment Status */}
                <section className="space-y-4">
                  <h3
                    className="text-2xl italic"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: tokens.onSurface,
                    }}
                  >
                    Payment Status
                  </h3>

                  <p
                    className="leading-7 text-sm"
                    style={{ color: tokens.onSurfaceVariant }}
                  >
                    Your payment has been securely processed and your order has
                    been confirmed.
                  </p>

                  <span
                    className="inline-block px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
                    style={{
                      backgroundColor: "#e7f5e9",
                      color: "#277436",
                    }}
                  >
                    {orderStatus === "paid" ? "Payment Confirmed" : orderStatus}
                  </span>
                </section>

                {/* Customer Details */}
                <section className="space-y-4">
                  <h3
                    className="text-2xl italic"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: tokens.onSurface,
                    }}
                  >
                    Customer Details
                  </h3>

                  <div
                    className="text-sm leading-7"
                    style={{ color: tokens.onSurfaceVariant }}
                  >
                    <p>
                      <span
                        className="font-medium"
                        style={{ color: tokens.onSurface }}
                      >
                        Name:
                      </span>{" "}
                      {user?.fullname || "Not available"}
                    </p>

                    <p>
                      <span
                        className="font-medium"
                        style={{ color: tokens.onSurface }}
                      >
                        Email:
                      </span>{" "}
                      {user?.email || "Not available"}
                    </p>

                    <p>
                      <span
                        className="font-medium"
                        style={{ color: tokens.onSurface }}
                      >
                        Contact:
                      </span>{" "}
                      {user?.contact || "Not available"}
                    </p>
                  </div>
                </section>

                {/* Payment Details */}
                <section className="space-y-4">
                  <h3
                    className="text-2xl italic"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: tokens.onSurface,
                    }}
                  >
                    Payment Details
                  </h3>

                  <div
                    className="space-y-4 p-5"
                    style={{ backgroundColor: tokens.surfaceLow }}
                  >
                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.18em]"
                        style={{ color: tokens.muted }}
                      >
                        Razorpay Order ID
                      </p>

                      <p
                        className="mt-1 text-xs break-all"
                        style={{ color: tokens.onSurface }}
                      >
                        {orderId}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.18em]"
                        style={{ color: tokens.muted }}
                      >
                        Razorpay Payment ID
                      </p>

                      <p
                        className="mt-1 text-xs break-all"
                        style={{ color: tokens.onSurface }}
                      >
                        {paymentId}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.18em]"
                        style={{ color: tokens.muted }}
                      >
                        Amount Paid
                      </p>

                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: tokens.primaryDark }}
                      >
                        {formatCurrency(totalAmount, currency)}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Actions */}
                <div className="flex flex-col gap-4 pt-6">
                  <Link
                    to="/collection"
                    className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: tokens.primaryDark,
                      color: "#ffffff",
                    }}
                  >
                    Continue Shopping
                  </Link>

                  <Link
                    to="/"
                    className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-colors"
                    style={{
                      backgroundColor: "transparent",
                      border: `1px solid ${tokens.outline}`,
                      color: tokens.onSurface,
                    }}
                  >
                    Go To Home
                  </Link>
                </div>
              </div>

              <div
                className="pt-10"
                style={{
                  borderTop: `1px solid ${tokens.outlineVariant}`,
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest leading-loose"
                  style={{ color: tokens.outline }}
                >
                  Your payment has been securely processed. Keep your order
                  reference and payment ID for future support inquiries.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OrderSuccess;
