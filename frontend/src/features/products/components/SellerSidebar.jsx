import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  BarChart3,
  Plus,
  Home,
} from "lucide-react";

const SellerSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      path: "/seller/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/seller/products",
      icon: Package,
    },
    {
      label: "Inventory",
      path: "/seller/inventory",
      icon: Boxes,
    },
    {
      label: "Orders",
      path: "/seller/orders",
      icon: ShoppingBag,
    },
    {
      label: "Analytics",
      path: "/seller/analytics",
      icon: BarChart3,
    },
  ];

  const goTo = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside className="h-full w-[280px] bg-[#12130f] text-[#fbf9f6] flex flex-col justify-between border-r border-white/10">
      <div>
        {/* Brand */}
        <div className="h-24 px-7 flex flex-col justify-center border-b border-white/10">
          <h1
            className="text-3xl text-[#C9A96E] leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Pehrawa
          </h1>

          <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-white/35">
            Seller Studio
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                className={`group relative w-full flex items-center gap-4 px-5 py-4 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  active
                    ? "bg-[#C9A96E] text-[#12130f]"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] transition-all ${
                    active ? "bg-[#fbf9f6]" : "bg-transparent"
                  }`}
                />

                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-5 space-y-3">
        <button
          onClick={() => goTo("/seller/create-product")}
          className="w-full py-4 bg-[#C9A96E] text-[#12130f] text-[11px] uppercase tracking-[0.22em] flex items-center justify-center gap-3 hover:bg-[#fbf9f6] transition-all"
        >
          <Plus size={16} />
          New Listing
        </button>

        <button
          onClick={() => goTo("/")}
          className="w-full py-4 border border-white/10 text-white/55 text-[11px] uppercase tracking-[0.22em] flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white transition-all"
        >
          <Home size={16} />
          Storefront
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;
