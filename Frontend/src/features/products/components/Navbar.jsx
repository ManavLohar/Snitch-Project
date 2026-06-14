import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

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
            <div className="flex items-center gap-2 text-[#e5e2e1]">
              {/* <span className="material-symbols-outlined text-[20px] text-[#ffe5a0]">
                person
              </span> */}
              <span className="font-sans text-sm font-semibold tracking-wide">
                {user.fullName || user.fullname || user.name || "Welcome!"}
              </span>
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
