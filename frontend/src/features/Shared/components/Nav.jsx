import React, { useState } from "react";
import { useSelector } from "react-redux";
import TransitionLink from "../../../app/TransitionLink";
import { useAuth } from "../../../features/auth/hook/useAuth";
import { Heart, ShoppingBag } from "lucide-react";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { handleLogout } = useAuth();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const logoutClick = async () => {
    setOpen(false);
    await handleLogout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fbf9f6] border-b border-[#e4e2df]">
      <div className="px-8 lg:px-16 xl:px-24 h-20 flex items-center justify-between">
        <TransitionLink to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Pehrawa"
            className="h-55 w-55 object-contain"
          />
        </TransitionLink>

        <div className="hidden md:flex items-center gap-10 text-[12px] uppercase tracking-[0.22em]">
          <TransitionLink
            to="/"
            className="hover:text-[#C9A96E] transition-colors"
          >
            Home
          </TransitionLink>
          <TransitionLink
            to="/collection"
            className="hover:text-[#C9A96E] transition-colors"
          >
            Collection
          </TransitionLink>
          <TransitionLink
            to="/about"
            className="hover:text-[#C9A96E] transition-colors"
          >
            About
          </TransitionLink>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <TransitionLink
                to="/login"
                className="px-5 py-3 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.22em]"
              >
                Sign In
              </TransitionLink>

              <TransitionLink
                to="/register"
                className="px-5 py-3 border border-[#1b1c1a] text-[#1b1c1a] text-[11px] uppercase tracking-[0.22em]"
              >
                Sign Up
              </TransitionLink>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="px-5 py-3 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.22em]"
              >
                {user.role === "seller" ? "Seller" : "Account"} ▾
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-64 bg-[#fbf9f6] border border-[#e4e2df] shadow-xl py-3">
                  <div className="px-5 py-3 border-b border-[#e4e2df]">
                    <p className="text-sm text-[#1b1c1a]">{user.fullname}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] mt-1">
                      {user.role}
                    </p>
                  </div>

                  {user.role === "seller" ? (
                    <TransitionLink
                      to="/seller/dashboard"
                      onClick={() => setOpen(false)}
                      className="block px-5 py-3 text-[12px] uppercase tracking-[0.18em] hover:bg-[#1b1c1a] hover:text-white"
                    >
                      Seller Dashboard
                    </TransitionLink>
                  ) : (
                    <TransitionLink
                      to="/orders"
                      onClick={() => setOpen(false)}
                      className="block px-5 py-3 text-[12px] uppercase tracking-[0.18em] hover:bg-[#1b1c1a] hover:text-white"
                    >
                      My Orders
                    </TransitionLink>
                  )}

                  <button
                    onClick={logoutClick}
                    className="w-full text-left px-5 py-3 text-[12px] uppercase tracking-[0.18em] text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <TransitionLink
            to="/wishlist"
            className="relative w-11 h-11 border border-[#1b1c1a] text-[#1b1c1a] flex items-center justify-center hover:bg-[#C9A96E] transition-all"
            aria-label="Wishlist"
          >
            <Heart size={21} strokeWidth={1.6} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C9A96E] text-[#1b1c1a] rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-semibold">
                {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
              </span>
            )}
          </TransitionLink>

          <TransitionLink
            to="/cart"
            className="relative w-11 h-11 bg-[#1b1c1a] text-[#fbf9f6] flex items-center justify-center hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
            aria-label="Cart"
          >
            <ShoppingBag size={21} strokeWidth={1.6} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C9A96E] text-[#1b1c1a] rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-semibold">
                {cartItems.length > 9 ? "9+" : cartItems.length}
              </span>
            )}
          </TransitionLink>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
