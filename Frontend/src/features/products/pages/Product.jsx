import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useCart } from "../../cart/hook/useCart";

/* ─── Accordion Item ──────────────────────────────────────────────────── */
const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-sans text-sm font-semibold uppercase tracking-widest text-[#e5e2e1] group-hover:text-[#f5c518] transition-colors duration-300">
          {title}
        </span>
        <span
          className="text-[#9a9078] transition-transform duration-300 text-xl select-none"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "400px" : "0px" }}
      >
        <div className="pb-5 text-[#d1c5ac] font-sans text-base leading-7">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ─── Star Rating ─────────────────────────────────────────────────────── */
const StarRating = ({ rating = 4.5, count = 128 }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill={
            star <= Math.floor(rating)
              ? "#f5c518"
              : star - 0.5 <= rating
                ? "url(#half)"
                : "#353534"
          }
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#f5c518" />
              <stop offset="50%" stopColor="#353534" />
            </linearGradient>
          </defs>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="font-sans text-sm text-[#9a9078]">
      {rating} ({count} reviews)
    </span>
  </div>
);

/* ─── Loading Skeleton ────────────────────────────────────────────────── */
const ProductSkeleton = () => (
  <div className="bg-[#131313] min-h-screen pt-24 px-4 md:px-16">
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
        <div className="space-y-4">
          <div className="aspect-4/5 bg-[#201f1f] w-full" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-[#201f1f]" />
            ))}
          </div>
        </div>
        <div className="space-y-6 pt-4">
          <div className="h-4 bg-[#201f1f] w-40 rounded" />
          <div className="h-12 bg-[#201f1f] w-3/4 rounded" />
          <div className="h-8 bg-[#201f1f] w-28 rounded" />
          <div className="h-20 bg-[#201f1f] w-full rounded" />
          <div className="h-14 bg-[#201f1f] w-full rounded" />
          <div className="h-14 bg-[#201f1f] w-full rounded" />
        </div>
      </div>
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────── */
const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { handleGetProductById } = useProduct();
  const user = useSelector((state) => state.auth.user);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const { handleAddItem } = useCart();

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedAttributes(product.variants[0].attributes || {});
    }
  }, [product]);

  const availableAttributes = React.useMemo(() => {
    const attrMap = {};
    if (product?.variants) {
      product.variants.forEach((variant) => {
        if (variant.attributes) {
          Object.entries(variant.attributes).forEach(([key, value]) => {
            if (!attrMap[key]) {
              attrMap[key] = new Set();
            }
            attrMap[key].add(value);
          });
        }
      });
    }
    const result = {};
    Object.keys(attrMap).forEach((key) => {
      result[key] = Array.from(attrMap[key]);
    });
    return result;
  }, [product]);

  const selectedVariant = React.useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((variant) => {
      if (!variant.attributes) return false;
      return (
        Object.keys(selectedAttributes).length > 0 &&
        Object.entries(selectedAttributes).every(
          ([key, value]) => variant.attributes[key] === value,
        )
      );
    });
  }, [product, selectedAttributes]);

  useEffect(() => {
    setActiveImage(0);
  }, [selectedVariant]);

  const handleAttributeSelect = (attrName, val) => {
    setSelectedAttributes((prev) => {
      const tentative = { ...prev, [attrName]: val };

      // 1. Check if tentative is a subset of any variant's attributes
      const exactMatch = product?.variants?.find((v) => {
        if (!v.attributes) return false;
        return Object.entries(tentative).every(
          ([k, vVal]) => v.attributes[k] === vVal,
        );
      });

      if (exactMatch) {
        return exactMatch.attributes;
      }

      // 2. If no exact match, find the first variant that has the clicked attribute
      const fallbackVariant = product?.variants?.find(
        (v) => v.attributes && v.attributes[attrName] === val,
      );

      if (fallbackVariant) {
        return fallbackVariant.attributes;
      }

      return tentative;
    });
  };

  /* fetch */
  useEffect(() => {
    const fetchingProduct = async () => {
      setLoading(true);
      try {
        const data = await handleGetProductById({ productId });
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchingProduct();
  }, [productId]);

  /* quantity helpers */
  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(99, q + 1));

  /* CTA handlers */
  const handleAddToCart = (productId, variantId) => {
    if (user) {
      setAddedToCart(true);
      handleAddItem({ productId, variantId, quantity });
      setTimeout(() => setAddedToCart(false), 2000);
    } else {
      navigate("/login");
    }
  };

  const handleBuyNow = () => {
    if (user) {
      setBuyingNow(true);
      setTimeout(() => setBuyingNow(false), 1500);
    } else {
      navigate("/login");
    }
  };

  /* format price */
  const formatPrice = (price) => {
    if (!price) return "";
    const symbol = price.currency === "INR" ? "₹" : price.currency;
    return `${symbol}${price.amount?.toLocaleString("en-IN")}`;
  };

  /* format date */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <>
        <ProductSkeleton />
      </>
    );

  if (!product) {
    return (
      <>
        <div className="bg-[#131313] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-[40px] font-bold text-white mb-4">
              Product Not Found
            </p>
            <p className="text-[#d1c5ac] font-sans mb-8">
              The item you're looking for doesn't exist or may have been
              removed.
            </p>
            <Link
              to="/"
              className="bg-[#f5c518] text-[#3d2f00] font-sans text-sm font-semibold uppercase px-10 py-4 tracking-widest hover:bg-[#ffe5a0] transition-all duration-300 inline-block"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </>
    );
  }

  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images && product.images.length > 0
        ? product.images
        : [];
  const currentImageUrl = images[activeImage]?.url;
  const displayPrice = selectedVariant?.price || product.price;

  return (
    <>
      {/* Google Fonts injected via style tag for portability */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');

        .product-img-zoom { transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .product-img-zoom:hover { transform: scale(1.04); }

        .btn-pulse {
          position: relative;
          overflow: hidden;
        }
        .btn-pulse::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .btn-pulse:hover::after {
          transform: translateX(100%);
        }

        .thumbnail-active {
          border: 1.5px solid #f5c518;
        }
        .thumbnail-inactive {
          border: 1.5px solid transparent;
          opacity: 0.6;
        }
        .thumbnail-inactive:hover {
          border-color: rgba(245,197,24,0.4);
          opacity: 1;
        }

        .qty-btn:hover {
          background: #f5c518;
          color: #3d2f00;
        }

        .accordion-enter { animation: accordionIn 0.3s ease forwards; }
        @keyframes accordionIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .tag-badge {
          display: inline-block;
          background: #f5c518;
          color: #3d2f00;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
        }
      `}</style>

      <div
        className="bg-[#131313] min-h-screen text-[#e5e2e1]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Main Content ── */}
        <main className="max-w-[1280px] mx-auto px-4 md:px-16 pt-28 pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10 text-xs font-sans uppercase tracking-widest">
            <Link
              to="/"
              className="text-[#9a9078] hover:text-[#f5c518] transition-colors duration-200"
            >
              Home
            </Link>
            <span className="text-[#4e4633]">/</span>
            <span className="text-[#e5e2e1]">{product.title}</span>
          </nav>

          {/* ── Two-Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 xl:gap-20">
            {/* ── LEFT: Image Gallery ── */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-4/5 overflow-hidden bg-[#1c1b1b] group">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover product-img-zoom"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#4e4633]">
                    <svg
                      className="w-20 h-20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {/* New-In Badge */}
                <div className="absolute top-4 left-4">
                  <span className="tag-badge">New In</span>
                </div>
                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1">
                    <span className="font-sans text-xs text-white/70 tracking-widest">
                      {activeImage + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={img._id || idx}
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-square overflow-hidden transition-all duration-300 ${
                        activeImage === idx
                          ? "thumbnail-active"
                          : "thumbnail-inactive"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.title} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {/* Placeholder slots to maintain grid */}
                  {images.length < 4 &&
                    [...Array(4 - images.length)].map((_, i) => (
                      <div
                        key={`placeholder-${i}`}
                        className="aspect-square bg-[#1c1b1b]"
                      />
                    ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product Info ── */}
            <div className="flex flex-col gap-6 lg:pt-2">
              {/* Title */}
              <div>
                <h1
                  className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {product.title}
                </h1>
                <StarRating rating={4.5} count={128} />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <p
                  className="text-[32px] font-bold text-[#f5c518]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {formatPrice(displayPrice)}
                </p>
                <span className="font-sans text-xs text-[#9a9078] uppercase tracking-widest">
                  Incl. of all taxes
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Description */}
              <p className="text-[#d1c5ac] font-sans text-base leading-7">
                {product.description}
              </p>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Variants / Attributes */}
              {Object.keys(availableAttributes).length > 0 && (
                <div className="space-y-4">
                  {Object.entries(availableAttributes).map(
                    ([attrName, values]) => (
                      <div key={attrName}>
                        <span className="font-sans text-sm uppercase tracking-widest text-[#9a9078] mb-2 block">
                          {attrName}
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {values.map((val) => (
                            <button
                              key={val}
                              onClick={() =>
                                handleAttributeSelect(attrName, val)
                              }
                              className={`px-4 py-2 font-sans text-sm tracking-wide border transition-all duration-300 ${
                                selectedAttributes[attrName] === val
                                  ? "border-[#f5c518] text-[#f5c518] bg-[#f5c518]/10"
                                  : "border-white/10 text-[#e5e2e1] hover:border-white/30"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                  {/* Divider */}
                  <div className="border-t border-white/10 mt-6" />
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm uppercase tracking-widest text-[#9a9078]">
                  Quantity
                </span>
                <div className="flex items-center border border-white/10 bg-[#1c1b1b]">
                  <button
                    id="qty-decrease"
                    onClick={decreaseQty}
                    className="qty-btn w-11 h-11 flex items-center justify-center text-[#e5e2e1] text-lg font-light transition-all duration-200 select-none"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-sans text-base font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    id="qty-increase"
                    onClick={increaseQty}
                    className="qty-btn w-11 h-11 flex items-center justify-center text-[#e5e2e1] text-lg font-light transition-all duration-200 select-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                {/* Buy Now */}
                <button
                  id="buy-now-btn"
                  onClick={handleBuyNow}
                  className="btn-pulse w-full py-5 bg-[#f5c518] text-[#3d2f00] font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#ffe5a0] transition-all duration-300 shadow-lg hover:shadow-[#f5c518]/20 hover:shadow-2xl active:scale-[0.99] hover:text-[#775d00]"
                  disabled={buyingNow}
                >
                  {buyingNow ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    "Buy Now"
                  )}
                </button>

                {/* Add to Cart */}
                <button
                  id="add-to-cart-btn"
                  onClick={() =>
                    handleAddToCart(productId, selectedVariant?._id)
                  }
                  className="w-full py-5 bg-transparent border border-[#f5c518] text-[#ffe5a0] font-sans text-sm font-semibold uppercase tracking-widest hover:bg-[#f5c518]/10 transition-all duration-300 active:scale-[0.99]"
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#f5c518]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added to Cart
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
                {[
                  {
                    icon: "🚚",
                    label: "Free Delivery",
                    sub: "Orders above ₹999",
                  },
                  { icon: "↩", label: "Easy Returns", sub: "Within 7 days" },
                  { icon: "🔒", label: "Secure Pay", sub: "100% protected" },
                ].map((badge) => (
                  <div key={badge.label} className="text-center">
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="font-sans text-xs font-semibold text-[#e5e2e1] uppercase tracking-wide">
                      {badge.label}
                    </p>
                    <p className="font-sans text-[11px] text-[#9a9078] mt-0.5">
                      {badge.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div>
                <AccordionItem title="Product Details">
                  <ul className="space-y-2">
                    <li>
                      <span className="text-[#9a9078] uppercase text-xs tracking-widest">
                        Product ID:{" "}
                      </span>
                      <span className="font-mono text-sm">{product._id}</span>
                    </li>
                    <li>
                      <span className="text-[#9a9078] uppercase text-xs tracking-widest">
                        Listed on:{" "}
                      </span>
                      {formatDate(product.createdAt)}
                    </li>
                    <li>
                      <span className="text-[#9a9078] uppercase text-xs tracking-widest">
                        Last Updated:{" "}
                      </span>
                      {formatDate(product.updatedAt)}
                    </li>
                    <li className="mt-3">
                      Premium craftsmanship meets contemporary design. Each
                      piece is carefully curated to meet Snitch's exacting
                      standards of quality and style.
                    </li>
                  </ul>
                </AccordionItem>

                <AccordionItem title="Shipping & Returns">
                  <ul className="space-y-2.5">
                    <li>✦ Free standard delivery on orders above ₹999</li>
                    <li>✦ Express delivery available at checkout</li>
                    <li>✦ Easy returns within 7 days of delivery</li>
                    <li>✦ Exchange available for size issues</li>
                  </ul>
                </AccordionItem>

                <AccordionItem title="Care Instructions">
                  <ul className="space-y-2.5">
                    <li>✦ Machine wash cold with similar colors</li>
                    <li>✦ Do not bleach</li>
                    <li>✦ Tumble dry low heat</li>
                    <li>✦ Iron on low setting if needed</li>
                    <li>✦ Do not dry clean</li>
                  </ul>
                </AccordionItem>

                <div className="border-t border-white/10" />
              </div>
            </div>
            {/* ── END RIGHT ── */}
          </div>
        </main>

        {/* ── Footer Strip ── */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-[1280px] mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className="font-bold text-[18px] text-[#e5e2e1] tracking-tighter"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              SNITCH
            </p>
            <p className="font-sans text-xs text-[#9a9078] tracking-widest uppercase">
              © {new Date().getFullYear()} Snitch. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Product;
