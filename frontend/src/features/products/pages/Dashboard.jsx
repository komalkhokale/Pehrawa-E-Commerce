import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSellerDashboardApi } from "../services/sellerDashboard.api";

import {
  Package,
  Boxes,
  TrendingUp,
  Wallet,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const initialDashboard = {
  totalProducts: 0,
  totalStock: 0,
  revenue: 0,
  profit: 0,
  expenses: 0,
  inventoryValue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  lowStock: 0,
  outOfStock: 0,
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSellerDashboardApi();

      console.log("Seller dashboard response:", response);

      setDashboard({
        ...initialDashboard,
        ...(response?.dashboard || {}),
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Dashboard data load nahi ho saka.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatMoney = (amount) => {
    return `INR ${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const cards = [
    {
      label: "Total Products",
      value: dashboard.totalProducts,
      icon: Package,
    },
    {
      label: "Total Stock",
      value: dashboard.totalStock,
      icon: Boxes,
    },
    {
      label: "Revenue",
      value: formatMoney(dashboard.revenue),
      icon: TrendingUp,
    },
    {
      label: "Profit",
      value: formatMoney(dashboard.profit),
      icon: Wallet,
    },
  ];

  const hasInventoryProblem =
    dashboard.lowStock > 0 || dashboard.outOfStock > 0;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <RefreshCw
            size={28}
            className="mx-auto text-[#C9A96E] animate-spin"
          />

          <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-[#9b8a78]">
            Loading Studio
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#fbf9f6] border border-[#e4d8c8] p-10 text-center">
          <AlertTriangle size={28} className="mx-auto text-[#C9A96E]" />

          <h2
            className="mt-5 text-3xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Dashboard unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#7A6E63]">{error}</p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-7 px-7 py-4 bg-[#1b1c1a] text-[#fbf9f6] text-[10px] uppercase tracking-[0.24em]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 xl:px-16 py-10">
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-[#fbf9f6] border border-[#e4d8c8] p-7 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition duration-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9b8a78]">
                  {card.label}
                </p>

                <Icon size={18} className="text-[#C9A96E]" />
              </div>

              <h2
                className="mt-5 text-4xl font-light text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Overview and health */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-[#fbf9f6] border border-[#e4d8c8] p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E]">
              Business Overview
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9b8a78] hover:text-[#C9A96E] transition"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-9 mt-8">
            <div>
              <p className="text-sm text-[#7A6E63]">Inventory Value</p>

              <h3
                className="text-3xl mt-2 text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {formatMoney(dashboard.inventoryValue)}
              </h3>
            </div>

            <div>
              <p className="text-sm text-[#7A6E63]">Expenses</p>

              <h3
                className="text-3xl mt-2 text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {formatMoney(dashboard.expenses)}
              </h3>
            </div>

            <div>
              <p className="text-sm text-[#7A6E63]">Orders</p>

              <h3
                className="text-3xl mt-2 text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {dashboard.totalOrders}
              </h3>
            </div>

            <div>
              <p className="text-sm text-[#7A6E63]">Low Stock</p>

              <h3
                className="text-3xl mt-2 text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {dashboard.lowStock}
              </h3>
            </div>

            <div>
              <p className="text-sm text-[#7A6E63]">Out of Stock</p>

              <h3
                className="text-3xl mt-2 text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {dashboard.outOfStock}
              </h3>
            </div>

            <div>
              <p className="text-sm text-[#7A6E63]">Customers</p>

              <h3
                className="text-3xl mt-2 text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {dashboard.totalCustomers}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-[#1b1c1a] text-[#fbf9f6] p-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E]">
            Studio Health
          </p>

          <h3
            className="mt-6 text-5xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {dashboard.outOfStock > 0
              ? "Needs Care"
              : dashboard.lowStock > 0
                ? "Watch Stock"
                : "Healthy"}
          </h3>

          <p className="mt-5 text-sm leading-6 text-white/50">
            {dashboard.outOfStock > 0
              ? `${dashboard.outOfStock} variant out of stock hai. Inventory update karo.`
              : dashboard.lowStock > 0
                ? `${dashboard.lowStock} variant ka stock kam hai. Jaldi restock karo.`
                : "Your inventory looks stable right now."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/seller/inventory")}
            className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#C9A96E] hover:gap-5 transition-all"
          >
            View Inventory
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Alerts and actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#fbf9f6] border border-[#e4d8c8] p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle
              size={18}
              className={
                hasInventoryProblem ? "text-[#C9A96E]" : "text-[#7A6E63]"
              }
            />

            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E]">
              Inventory Alerts
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between border-b border-[#e4d8c8] pb-4">
              <span className="text-sm text-[#7A6E63]">Low Stock Variants</span>

              <span className="text-[#1b1c1a]">{dashboard.lowStock}</span>
            </div>

            <div className="flex justify-between border-b border-[#e4d8c8] pb-4">
              <span className="text-sm text-[#7A6E63]">Out of Stock</span>

              <span className="text-[#1b1c1a]">{dashboard.outOfStock}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-[#7A6E63]">Total Stock Units</span>

              <span className="text-[#1b1c1a]">{dashboard.totalStock}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#fbf9f6] border border-[#e4d8c8] p-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A96E]">
            Quick Actions
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate("/seller/create-product")}
              className="p-5 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.22em] hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition"
            >
              Add Product
            </button>

            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="p-5 border border-[#d0c5b5] text-[11px] uppercase tracking-[0.22em] hover:bg-[#1b1c1a] hover:text-white transition"
            >
              Manage Products
            </button>

            <button
              type="button"
              onClick={() => navigate("/seller/inventory")}
              className="p-5 border border-[#d0c5b5] text-[11px] uppercase tracking-[0.22em] hover:bg-[#1b1c1a] hover:text-white transition"
            >
              Inventory
            </button>

            <button
              type="button"
              onClick={() => navigate("/seller/orders")}
              className="p-5 border border-[#d0c5b5] text-[11px] uppercase tracking-[0.22em] hover:bg-[#1b1c1a] hover:text-white transition"
            >
              Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
