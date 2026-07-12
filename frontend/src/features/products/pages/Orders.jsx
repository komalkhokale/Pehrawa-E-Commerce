import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Box,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  LoaderCircle,
  Mail,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import { getSellerOrdersApi } from "../services/sellerOrders.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSellerOrdersApi();

      console.log("Seller orders:", response);

      setOrders(response?.orders || []);
    } catch (error) {
      console.error("Seller orders error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Orders load nahi ho sake.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const formatMoney = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      packed: "bg-amber-50 text-amber-700 border-amber-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      paid: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      failed: "bg-red-50 text-red-700 border-red-200",
    };

    return (
      styles[status?.toLowerCase()] ||
      "bg-[#f4efe8] text-[#7A6E63] border-[#e4d8c8]"
    );
  };

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        order.orderStatus?.toLowerCase() === statusFilter;

      const searchableText = [
        order._id,
        order.razorpayOrderId,
        order.customer?.fullname,
        order.customer?.email,
        ...(order.items?.map((item) => item.title) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0,
    );
  }, [orders]);

  const totalItems = useMemo(() => {
    return orders.reduce((orderTotal, order) => {
      return (
        orderTotal +
        (order.items || []).reduce(
          (itemTotal, item) => itemTotal + Number(item.quantity || 0),
          0,
        )
      );
    }, 0);
  }, [orders]);

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered",
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== "delivered" && order.orderStatus !== "cancelled",
  ).length;

  const summaryCards = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      label: "Revenue",
      value: formatMoney(totalRevenue),
      icon: CircleDollarSign,
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: Truck,
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: PackageCheck,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <LoaderCircle size={30} className="animate-spin text-[#C9A96E]" />

        <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#9b8a78]">
          Loading Orders
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md border border-[#e4d8c8] bg-[#fbf9f6] p-10 text-center">
          <AlertCircle size={30} className="mx-auto text-[#C9A96E]" />

          <h2
            className="mt-5 text-3xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Orders unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#7A6E63]">{error}</p>

          <button
            type="button"
            onClick={loadOrders}
            className="mt-7 bg-[#1b1c1a] px-7 py-4 text-[10px] uppercase tracking-[0.25em] text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-8 sm:px-8 lg:px-12 xl:px-16">

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="border border-[#e4d8c8] bg-[#fbf9f6] p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#9b8a78]">
                  {card.label}
                </p>

                <Icon size={18} className="text-[#C9A96E]" />
              </div>

              <h2
                className="mt-5 text-3xl font-light text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex flex-col gap-4 border border-[#e4d8c8] bg-[#fbf9f6] p-4 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8a78]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer or product..."
            className="w-full border border-[#e4d8c8] bg-white py-4 pl-11 pr-4 text-sm text-[#1b1c1a] outline-none transition focus:border-[#C9A96E]"
          />
        </div>

        <div className="relative min-w-[210px]">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full appearance-none border border-[#e4d8c8] bg-white px-4 py-4 pr-10 text-sm text-[#5e5145] outline-none focus:border-[#C9A96E]"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9b8a78]"
          />
        </div>
      </div>

      {/* Empty state */}
      {filteredOrders.length === 0 ? (
        <div className="border border-[#e4d8c8] bg-[#fbf9f6] px-6 py-20 text-center">
          <ShoppingBag size={34} className="mx-auto text-[#C9A96E]" />

          <h2
            className="mt-5 text-3xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            No orders found
          </h2>

          <p className="mt-3 text-sm text-[#7A6E63]">
            {orders.length === 0
              ? "Abhi tumhare products ka koi paid order nahi hai."
              : "Search ya filter ke according koi order nahi mila."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            const firstItem = order.items?.[0];
            const firstImage = firstItem?.images?.[0]?.url;

            return (
              <article
                key={order._id}
                className="overflow-hidden border border-[#e4d8c8] bg-[#fbf9f6]"
              >
                {/* Order top */}
                <div className="flex flex-col gap-5 border-b border-[#e4d8c8] p-5 lg:flex-row lg:items-center lg:justify-between lg:p-7">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#1b1c1a] text-[#C9A96E]">
                      <Box size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#9b8a78]">
                        Order ID
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-[#1b1c1a]">
                        #{order._id?.slice(-10).toUpperCase()}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-[#7A6E63]">
                        <CalendarDays size={13} />

                        <span>
                          {formatDate(order.createdAt)} ·{" "}
                          {formatTime(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`border px-3 py-2 text-[9px] uppercase tracking-[0.18em] ${getStatusStyle(
                        order.paymentStatus,
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span
                      className={`border px-3 py-2 text-[9px] uppercase tracking-[0.18em] ${getStatusStyle(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order._id)
                      }
                      className="flex items-center gap-2 border border-[#d7c8b6] px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-[#5e5145] transition hover:bg-[#1b1c1a] hover:text-white"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}

                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Main summary */}
                <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-3 lg:p-7">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-16 shrink-0 overflow-hidden bg-[#eee8df]">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={firstItem?.title || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag size={20} className="text-[#9b8a78]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#9b8a78]">
                        Products
                      </p>

                      <h3 className="mt-1 truncate text-base text-[#1b1c1a]">
                        {firstItem?.title || "Product"}
                      </h3>

                      <p className="mt-1 text-xs text-[#7A6E63]">
                        {order.items?.length || 0} product type · {totalItems}{" "}
                        total units
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#e4d8c8] pt-5 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                    <div className="flex items-center gap-2">
                      <User size={15} className="text-[#C9A96E]" />

                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#9b8a78]">
                        Customer
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-medium text-[#1b1c1a]">
                      {order.customer?.fullname || "Customer"}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-[#7A6E63]">
                      <Mail size={13} />

                      <span className="truncate">
                        {order.customer?.email || "Email unavailable"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#e4d8c8] pt-5 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#9b8a78]">
                      Seller Total
                    </p>

                    <p
                      className="mt-3 text-3xl font-light text-[#1b1c1a]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {formatMoney(order.totalAmount, order.currency)}
                    </p>

                    <p className="mt-1 text-xs text-[#7A6E63]">
                      {order.items?.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
                      )}{" "}
                      items
                    </p>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-[#e4d8c8] bg-white p-5 lg:p-7">
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
                        Ordered Products
                      </p>

                      <p className="text-xs text-[#9b8a78]">
                        Razorpay: {order.razorpayOrderId || "—"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item, index) => {
                        const image = item.images?.[0]?.url;

                        return (
                          <div
                            key={`${item.productId}-${item.variantId}-${index}`}
                            className="flex flex-col justify-between gap-5 border border-[#eee5da] p-4 sm:flex-row sm:items-center"
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <div className="h-20 w-16 shrink-0 overflow-hidden bg-[#eee8df]">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <ShoppingBag
                                      size={19}
                                      className="text-[#9b8a78]"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <h4 className="truncate text-base text-[#1b1c1a]">
                                  {item.title}
                                </h4>

                                <p className="mt-1 text-xs text-[#7A6E63]">
                                  Quantity: {item.quantity}
                                </p>

                                <p className="mt-1 text-xs text-[#9b8a78]">
                                  Variant:{" "}
                                  {item.variantId?.slice(-8).toUpperCase()}
                                </p>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-sm text-[#1b1c1a]">
                                {formatMoney(
                                  item.price?.amount,
                                  item.price?.currency,
                                )}{" "}
                                × {item.quantity}
                              </p>

                              <p className="mt-2 text-lg font-medium text-[#1b1c1a]">
                                {formatMoney(
                                  Number(item.price?.amount || 0) *
                                    Number(item.quantity || 1),
                                  item.price?.currency,
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-[#e4d8c8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#7A6E63]">
                        {order.paymentStatus === "paid" ? (
                          <CheckCircle2 size={15} className="text-green-600" />
                        ) : (
                          <XCircle size={15} className="text-red-600" />
                        )}
                        Payment {order.paymentStatus}
                      </div>

                      <p className="text-lg font-medium text-[#1b1c1a]">
                        Total: {formatMoney(order.totalAmount, order.currency)}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
