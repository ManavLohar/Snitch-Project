import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useCart } from "../../cart/hook/useCart";

const Navbar = () => {
  const { handleGetItems } = useCart();
  const user = useSelector((state) => state.auth.user);
  const cartItemsData = useSelector((state) => state.cart);
  useEffect(() => {
    handleGetItems();
  }, []);
  const items = cartItemsData.items ? cartItemsData.items : cartItemsData;
  const cartItemCount = items?.length || 0;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-md border-b border-white/10">
      <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-[1280px] mx-auto h-16 md:h-20">
        {/* Left Links */}
        <div className="flex-1 hidden md:flex gap-6">
          <Link
            to="/"
            className="font-sans text-sm uppercase tracking-widest text-[#ffe5a0] border-b-2 border-[#ffe5a0] pb-1 hover:text-[#ffe5a0] transition-colors duration-300"
          >
            Shop
          </Link>
          <a
            href="#"
            className="font-sans text-sm uppercase tracking-widest text-[#e5e2e1] hover:text-[#ffe5a0] transition-colors duration-300"
          >
            Collections
          </a>
          <a
            href="#"
            className="font-sans text-sm uppercase tracking-widest text-[#e5e2e1] hover:text-[#ffe5a0] transition-colors duration-300"
          >
            Editorial
          </a>
        </div>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center">
          <Link
            to="/"
            className="font-serif text-[24px] md:text-[32px] font-bold tracking-tighter text-[#e5e2e1] hover:opacity-80 transition-opacity"
          >
            SNITCH
          </Link>
        </div>

        {/* Right Section (User / Login) */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {user ? (
            <div className="flex items-center gap-6 text-[#e5e2e1]">
              <span className="flex items-center gap-1 uppercase tracking-wider font-sans text-sm font-semibold bg-[#f5c518] text-black p-2 rounded-md">
                <MdOutlineAccountCircle size={24} />
                {user.fullName || user.fullname || user.name || "Welcome!"}
              </span>
              <p className="uppercase font-extralight text-sm tracking-wider">
                {user?.role === "seller" && "Seller Dashboard"}
              </p>
              <Link
                to="/cart"
                className="hover:text-[#f5c518] transition-colors duration-300 relative"
                aria-label="Cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f5c518] text-[#3d2f00] text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#f5c518] text-[#3d2f00] px-6 py-2 font-sans text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe5a0] transition-colors duration-300"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
