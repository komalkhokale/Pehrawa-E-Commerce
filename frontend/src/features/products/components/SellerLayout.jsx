import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SellerSidebar from "./SellerSidebar";
import SellerHeader from "./SellerHeader";

const SellerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#f6f2ea] text-[#1b1c1a]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Mobile Top Bar */}
      <div className="lg:hidden h-16 bg-[#12130f] text-[#fbf9f6] flex items-center justify-between px-5">
        <p
          className="text-2xl text-[#C9A96E]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Pehrawa
        </p>

        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 flex items-center justify-center border border-white/10"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-[280px]">
        <SellerSidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          <div className="absolute left-0 top-0 h-full">
            <SellerSidebar onClose={() => setMobileOpen(false)} />
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 bg-[#fbf9f6] text-[#12130f] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Page Content */}
      <main className="lg:ml-[280px] min-h-screen">
        <SellerHeader />
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
