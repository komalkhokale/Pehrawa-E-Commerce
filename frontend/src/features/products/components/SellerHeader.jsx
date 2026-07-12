import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Plus, Search } from "lucide-react";

const SellerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageMap = {
    "/seller/dashboard": {
      eyebrow: "Dashboard",
      title: "Good Morning, Komal",
      subtitle: "Here is your  studio overview.",
    },
    "/seller/products": {
      eyebrow: "Products",
      title: "Product Library",
      subtitle: "Manage all your product listings from one workspace.",
    },
    "/seller/inventory": {
      eyebrow: "Inventory",
      title: "Stock Control",
      subtitle: "Track availability, low stock, and restock needs.",
    },
    "/seller/orders": {
      eyebrow: "Orders",
      title: "Order Desk",
      subtitle: "Review customer orders and fulfillment status.",
    },
    "/seller/analytics": {
      eyebrow: "Analytics",
      title: "Studio Analytics",
      subtitle: "Measure revenue, growth, and collection performance.",
    },
    "/seller/create-product": {
      eyebrow: "New Listing",
      title: "Create Product",
      subtitle: "Add a new product to your catalogue.",
    },
  };

  const current =
    pageMap[location.pathname] ||
    (location.pathname.includes("/seller/product/")
      ? {
          eyebrow: "Product Detail",
          title: "Product Studio",
          subtitle: "Manage variants, inventory and product details.",
        }
      : {
          eyebrow: "Studio",
          title: "Pehrawa Studio",
          subtitle: "Manage your fashion business.",
        });

  return (
    <header className="sticky top-0 z-30 bg-[#f6f2ea]/85 backdrop-blur-xl border-b border-[#e4d8c8]">
      <div className="px-6 lg:px-12 xl:px-16 py-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#C9A96E] mb-3">
              {current.eyebrow}
            </p>

            <h1
              className="text-4xl lg:text-5xl font-light leading-none text-[#1b1c1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {current.title}
            </h1>

            <p className="mt-3 text-sm text-[#7A6E63]">{current.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B5ADA3]"
              />

              <input
                placeholder="Search studio..."
                className="w-full sm:w-[260px] bg-[#fbf9f6] border border-[#e4d8c8] py-3.5 pl-11 pr-4 outline-none text-sm placeholder:text-[#B5ADA3]"
              />
            </div>

            <button className="w-12 h-12 bg-[#fbf9f6] border border-[#e4d8c8] flex items-center justify-center text-[#1b1c1a] hover:border-[#C9A96E] transition">
              <Bell size={17} />
            </button>

            <button
              onClick={() => navigate("/seller/create-product")}
              className="h-12 px-6 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition"
            >
              <Plus size={15} />
              New Listing
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
