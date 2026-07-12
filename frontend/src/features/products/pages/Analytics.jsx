import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Boxes,
  CircleDollarSign,
  LoaderCircle,
  RefreshCw,
  ShoppingBag,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getSellerAnalyticsApi } from "../services/sellerAnalytics.api";

const initialAnalytics = {
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProductsSold: 0,
    totalCustomers: 0,
  },
  weeklyData: [],
  monthlyData: [],
  categoryData: [],
  topProducts: [],
};

const CHART_COLORS = [
  "#C9A96E",
  "#1b1c1a",
  "#9b8a78",
  "#d9c7ad",
  "#6f6257",
  "#b89b72",
];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSellerAnalyticsApi();

      console.log("Seller analytics:", response);

      setAnalytics({
        ...initialAnalytics,
        ...(response?.analytics || {}),
        summary: {
          ...initialAnalytics.summary,
          ...(response?.analytics?.summary || {}),
        },
      });
    } catch (error) {
      console.error("Analytics fetch error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Analytics load nahi ho saka.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const weeklyRevenue = useMemo(() => {
    return analytics.weeklyData.reduce(
      (total, day) => total + Number(day.revenue || 0),
      0,
    );
  }, [analytics.weeklyData]);

  const weeklyOrders = useMemo(() => {
    return analytics.weeklyData.reduce(
      (total, day) => total + Number(day.orders || 0),
      0,
    );
  }, [analytics.weeklyData]);

  const summaryCards = [
    {
      label: "Total Revenue",
      value: formatMoney(analytics.summary.totalRevenue),
      icon: CircleDollarSign,
    },
    {
      label: "Total Orders",
      value: analytics.summary.totalOrders,
      icon: ShoppingBag,
    },
    {
      label: "Products Sold",
      value: analytics.summary.totalProductsSold,
      icon: Boxes,
    },
    {
      label: "Customers",
      value: analytics.summary.totalCustomers,
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <LoaderCircle size={30} className="animate-spin text-[#C9A96E]" />

        <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#9b8a78]">
          Loading Analytics
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
            Analytics unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#7A6E63]">{error}</p>

          <button
            type="button"
            onClick={loadAnalytics}
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

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 border border-[#e4d8c8] bg-[#fbf9f6] p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
                Last 7 Days
              </p>

              <h2
                className="mt-2 text-2xl font-light text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Revenue Performance
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-[#9b8a78]">Weekly Revenue</p>

              <p className="mt-1 text-xl text-[#1b1c1a]">
                {formatMoney(weeklyRevenue)}
              </p>
            </div>
          </div>

          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee5da" />

                <XAxis
                  dataKey="label"
                  tick={{ fill: "#7A6E63", fontSize: 12 }}
                  axisLine={{ stroke: "#d8ccbd" }}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#7A6E63", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    value >= 1000 ? `₹${value / 1000}k` : `₹${value}`
                  }
                />

                <Tooltip
                  formatter={(value) => [formatMoney(value), "Revenue"]}
                  contentStyle={{
                    background: "#1b1c1a",
                    border: "none",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#C9A96E" }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C9A96E"
                  strokeWidth={3}
                  dot={{
                    fill: "#1b1c1a",
                    stroke: "#C9A96E",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-[#e4d8c8] bg-[#1b1c1a] p-6 text-white lg:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
            Weekly Snapshot
          </p>

          <div className="mt-8 space-y-7">
            <div>
              <p className="text-xs text-white/50">Revenue</p>

              <p
                className="mt-2 text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {formatMoney(weeklyRevenue)}
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-xs text-white/50">Orders</p>

              <p
                className="mt-2 text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {weeklyOrders}
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-xs text-white/50">Average Order Value</p>

              <p
                className="mt-2 text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {formatMoney(
                  weeklyOrders > 0 ? weeklyRevenue / weeklyOrders : 0,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="border border-[#e4d8c8] bg-[#fbf9f6] p-6 lg:p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
              Order Activity
            </p>

            <h2
              className="mt-2 text-2xl font-light text-[#1b1c1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Orders by Day
            </h2>
          </div>

          <div className="mt-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee5da" />

                <XAxis
                  dataKey="label"
                  tick={{ fill: "#7A6E63", fontSize: 12 }}
                  axisLine={{ stroke: "#d8ccbd" }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#7A6E63", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [value, "Orders"]}
                  contentStyle={{
                    background: "#1b1c1a",
                    border: "none",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#C9A96E" }}
                />

                <Bar dataKey="orders" fill="#C9A96E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-[#e4d8c8] bg-[#fbf9f6] p-6 lg:p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
              Sales Distribution
            </p>

            <h2
              className="mt-2 text-2xl font-light text-[#1b1c1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Revenue by Category
            </h2>
          </div>

          {analytics.categoryData.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <BarChart3 size={32} className="text-[#C9A96E]" />

              <p className="mt-4 text-sm text-[#7A6E63]">
                Category sales data abhi available nahi hai.
              </p>
            </div>
          ) : (
            <div className="mt-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [formatMoney(value), "Revenue"]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "#7A6E63",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 border border-[#e4d8c8] bg-[#fbf9f6] p-6 lg:p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
              Revenue Trend
            </p>

            <h2
              className="mt-2 text-2xl font-light text-[#1b1c1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Monthly Revenue
            </h2>
          </div>

          {analytics.monthlyData.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <BarChart3 size={32} className="text-[#C9A96E]" />

              <p className="mt-4 text-sm text-[#7A6E63]">
                Monthly revenue data abhi available nahi hai.
              </p>
            </div>
          ) : (
            <div className="mt-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyData} barCategoryGap="35%">
                  <defs>
                    <linearGradient
                      id="monthlyRevenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#C9A96E" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#E8D8BC"
                        stopOpacity={0.75}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#eee5da" />

                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#7A6E63", fontSize: 12 }}
                    axisLine={{ stroke: "#d8ccbd" }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fill: "#7A6E63", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      value >= 1000 ? `₹${value / 1000}k` : `₹${value}`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [formatMoney(value), "Revenue"]}
                    contentStyle={{
                      background: "#1b1c1a",
                      border: "none",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#C9A96E" }}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="url(#monthlyRevenueGradient)"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={90}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="border border-[#e4d8c8] bg-[#fbf9f6] p-6 lg:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">
            Best Performers
          </p>

          <h2
            className="mt-2 text-2xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Top Products
          </h2>

          {analytics.topProducts.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
              <ShoppingBag size={30} className="text-[#C9A96E]" />

              <p className="mt-4 text-sm text-[#7A6E63]">
                Abhi koi product sale record nahi hai.
              </p>
            </div>
          ) : (
            <div className="mt-7 space-y-5">
              {analytics.topProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between gap-4 border-b border-[#e4d8c8] pb-4 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#1b1c1a] text-xs text-[#C9A96E]">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1b1c1a]">
                        {product.title}
                      </p>

                      <p className="mt-1 text-xs text-[#7A6E63]">
                        {product.sold} units sold
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm text-[#1b1c1a]">
                    {formatMoney(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
