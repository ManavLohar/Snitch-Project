import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    handleGetAllProducts();
  }, [handleGetAllProducts]);

  return (
    <>
      <div className="bg-[#131313] min-h-screen text-[#e5e2e1] font-sans overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/hxftqwaja/snitch/f94aa09a-e414-4d97-8804-975f1ccf2160_mcXjTWiPz.jpeg')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131313]/80 to-[#131313]"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <p className="font-sans text-sm uppercase tracking-[0.3em] mb-4 text-[#ffe5a0] opacity-90 font-semibold">
              Est. 2024
            </p>
            <h2 className="font-serif text-[48px] md:text-[64px] leading-tight mb-8 max-w-4xl mx-auto italic md:not-italic font-bold tracking-tight text-white">
              THE ART OF LUXURY
            </h2>
            <div className="mt-8">
              <button className="bg-[#f5c518] text-[#3d2f00] font-sans text-sm font-semibold uppercase px-12 py-5 hover:bg-[#ffe5a0] transition-all duration-500 tracking-widest shadow-xl scale-100 hover:scale-105">
                SHOP THE COLLECTION
              </button>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 text-white">
            <span className="material-symbols-outlined text-[32px]">
              keyboard_double_arrow_down
            </span>
          </div>
        </section>

        {/* Content Wrapper */}
        <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-20">
          {/* Featured Products Section */}
          <section className="mb-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
              <div className="max-w-xl">
                <h3 className="font-serif text-[32px] md:text-[40px] font-bold mb-4 text-white">
                  SEASONAL CURATION
                </h3>
                <p className="text-[#d1c5ac] font-sans text-base">
                  An exquisite selection of tailored pieces and high-performance
                  essentials designed for the discerning modern individual.
                </p>
              </div>
              <a
                className="mt-4 md:mt-0 font-sans text-sm font-semibold uppercase tracking-widest border-b border-[#ffe5a0] text-[#ffe5a0] pb-1 hover:opacity-80 transition-opacity"
                href="#"
              >
                View All Products
              </a>
            </div>

            {/* Symmetrical Grid for Products */}
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group"
                  >
                    <div className="relative overflow-hidden bg-[#1c1b1b] aspect-[4/5]">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#d1c5ac]">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 uppercase font-sans text-xs tracking-widest hover:bg-white hover:text-black transition-all">
                          Quick View
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-start">
                      <div className="overflow-hidden pr-2">
                        <h4 className="font-serif text-[24px] font-semibold text-white truncate">
                          {product.title}
                        </h4>
                        <p className="text-[#d1c5ac] font-sans text-base mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <p className="font-serif text-[24px] font-semibold text-[#ffe5a0] shrink-0">
                        {product.price?.currency === "INR"
                          ? "₹"
                          : product.price?.currency}{" "}
                        {product.price?.amount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-[#a5abb6]">
                <p className="text-lg">No products available at the moment.</p>
              </div>
            )}
          </section>

          {/* Brand Ethos Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
            <div className="bg-[#2a2a2a] p-8 md:p-12 flex flex-col justify-center min-h-[400px]">
              <h3 className="font-serif text-[32px] md:text-[40px] font-bold mb-4 italic text-white">
                CRAFTED FOR THE BOLD
              </h3>
              <p className="text-[#d1c5ac] font-sans text-lg mb-8">
                Luxury isn't just what you wear; it's the narrative you inhabit.
                Every Snitch piece is a statement of uncompromising quality and
                avant-garde vision.
              </p>
              <div>
                <button className="border border-[#9a9078] text-[#e5e2e1] px-10 py-4 font-sans text-sm font-semibold uppercase tracking-widest hover:bg-[#e5e2e1] hover:text-[#131313] transition-all duration-300">
                  Discover Our Process
                </button>
              </div>
            </div>
            <div className="relative group overflow-hidden h-[400px] md:h-auto">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url('https://ik.imagekit.io/hxftqwaja/snitch/8c2bcc22b69b7b17e6f6e89326028702_1EnK9rvDN.jpg')",
                }}
              ></div>
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
