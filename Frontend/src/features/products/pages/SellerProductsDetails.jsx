import React, { useEffect, useRef, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useParams, useNavigate } from "react-router";

/* ─────────────────────────────────────────────
   Small reusable UI atoms
───────────────────────────────────────────── */
const Label = ({ children }) => (
  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#d1c5ac]">
    {children}
  </span>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full bg-[#2a2a2a] text-[#e5e2e1] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#f5c518] ${className}`}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <div className={`relative ${className}`}>
    <select
      {...props}
      className="w-full bg-[#2a2a2a] text-[#e5e2e1] border border-white/10 rounded-lg pl-3.5 pr-9 py-2.5 text-sm outline-none appearance-none cursor-pointer focus:border-[#f5c518] transition-colors"
    >
      {children}
    </select>
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9a9078]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      width="14"
      height="14"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  </div>
);

const IconBtn = ({ onClick, title, children, danger = false }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex items-center justify-center w-[30px] h-[30px] rounded-md shrink-0 transition-colors ${
      danger
        ? "bg-[#93000a]/30 text-[#ffb4ab] hover:bg-[#93000a] hover:text-white"
        : "bg-[#353534] text-[#d1c5ac] hover:bg-[#201f1f] hover:text-[#e5e2e1]"
    }`}
  >
    {children}
  </button>
);

/* ─────────────────────────────────────────────
   Currency symbol helper
───────────────────────────────────────────── */
const currencySymbol = (currency) => {
  const map = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };
  return map[currency] ?? currency;
};

/* ─────────────────────────────────────────────
   VariantCard
───────────────────────────────────────────── */
const VariantCard = ({ variant, productId, onStockChange, onDelete }) => {
  const attrs = variant.attributes
    ? Object.entries(
        variant.attributes instanceof Map
          ? Object.fromEntries(variant.attributes)
          : variant.attributes,
      )
    : [];

  const [localStock, setLocalStock] = useState(variant.stock ?? 0);
  const [saving, setSaving] = useState(false);

  const changeStock = async (delta) => {
    const next = Math.max(0, localStock + delta);
    setLocalStock(next);
    setSaving(true);
    try {
      await onStockChange(variant._id, next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#1c1b1b] border border-white/10 rounded-xl overflow-hidden flex flex-col relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      {/* Delete button */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <IconBtn
          danger
          title="Delete variant"
          onClick={() => onDelete(variant._id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            width="14"
            height="14"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </IconBtn>
      </div>

      {/* Thumbnail */}
      <div className="h-40 bg-[#2a2a2a] overflow-hidden">
        {variant.images && variant.images.length > 0 ? (
          <img
            src={variant.images[0].url}
            alt="variant"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#4e4633]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              width="40"
              height="40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 grow">
        {/* Attribute chips */}
        {attrs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {attrs.map(([k, v]) => (
              <span
                key={k}
                className="px-2.5 py-1 rounded-full border border-[#f5c518] text-[#f5c518] text-[11px] font-medium tracking-wide"
              >
                {k}: {v}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <span className="font-['Playfair_Display',serif] text-xl font-semibold text-[#f5c518]">
          {currencySymbol(variant.price?.currency)}
          {variant.price?.amount?.toLocaleString()}
        </span>

        {/* Stock counter */}
        <div className="flex items-center gap-2 border-t border-white/10 pt-3 mt-auto">
          <Label>Stock</Label>
          <div className="flex items-center ml-auto">
            <button
              onClick={() => changeStock(-1)}
              disabled={saving || localStock <= 0}
              className={`w-8 h-8 flex items-center justify-center bg-[#353534] border border-white/10 rounded-l-md text-[#e5e2e1] transition-colors ${
                localStock <= 0
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:bg-[#2a2a2a]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                width="12"
                height="12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 12H6"
                />
              </svg>
            </button>
            <div
              className={`min-w-[48px] h-8 flex items-center justify-center bg-[#201f1f] border-y border-white/10 text-sm font-semibold transition-colors ${
                saving ? "text-[#f5c518]" : "text-[#e5e2e1]"
              }`}
            >
              {localStock}
            </div>
            <button
              onClick={() => changeStock(1)}
              disabled={saving}
              className={`w-8 h-8 flex items-center justify-center bg-[#353534] border border-white/10 rounded-r-md text-[#e5e2e1] transition-colors ${
                saving
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-[#2a2a2a]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                width="12"
                height="12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   AddVariantForm
───────────────────────────────────────────── */
const MAX_VARIANT_IMAGES = 7;

const AddVariantForm = ({ productId, onSuccess }) => {
  const { handleAddProductVariant } = useProduct();
  const fileRef = useRef(null);

  const [images, setImages] = useState([]);
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [stock, setStock] = useState("0");
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_VARIANT_IMAGES - images.length;
    const picked = files.slice(0, remaining).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...picked]);
    e.target.value = "";
  };

  const removeImage = (i) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[i].preview);
      next.splice(i, 1);
      return next;
    });
  };

  const addAttribute = () =>
    setAttributes((prev) => [...prev, { key: "", value: "" }]);

  const removeAttribute = (i) =>
    setAttributes((prev) => prev.filter((_, idx) => idx !== i));

  const updateAttribute = (i, field, val) =>
    setAttributes((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!priceAmount) {
      setError("Price amount is required.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("priceAmount", priceAmount);
      fd.append("priceCurrency", priceCurrency);
      fd.append("stock", stock);
      images.forEach(({ file }) => fd.append("images", file));
      const validAttrs = attributes.filter(
        (a) => a.key.trim() && a.value.trim(),
      );
      const attrsObj = {};
      validAttrs.forEach((a) => {
        attrsObj[a.key.trim()] = a.value.trim();
      });
      fd.append("attributes", JSON.stringify(attrsObj));

      await handleAddProductVariant({ productId, formData: fd });

      images.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setImages([]);
      setPriceAmount("");
      setPriceCurrency("INR");
      setStock("0");
      setAttributes([{ key: "", value: "" }]);
      onSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.message ??
          "Failed to create variant. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#1c1b1b] border border-white/10 rounded-2xl p-8">
      <h2 className="font-['Playfair_Display',serif] text-2xl font-semibold text-[#e5e2e1] mb-7">
        Add New Variant
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Image upload */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <Label>Variant Images</Label>
            <span className="text-xs text-[#9a9078]">
              {images.length} / {MAX_VARIANT_IMAGES}
            </span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          <div className="flex gap-2.5 flex-wrap">
            {images.length < MAX_VARIANT_IMAGES && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#f5c518]/40 rounded-xl bg-[#2a2a2a] text-[#f5c518]/80 cursor-pointer transition-all shrink-0 hover:border-[#f5c518] hover:text-[#f5c518] hover:bg-[#353534]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="24"
                  height="24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
                <span className="text-[10px] font-medium">Upload</span>
              </button>
            )}
            {images.map((img, i) => (
              <div
                key={i}
                className="w-[100px] h-[100px] rounded-xl overflow-hidden relative border border-white/10 shrink-0"
              >
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    width="10"
                    height="10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#4e4633] m-0">
            First image becomes the thumbnail. Up to {MAX_VARIANT_IMAGES}{" "}
            images.
          </p>
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div className="flex flex-col gap-2">
            <Label>Price Amount</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 1999"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Currency</Label>
            <Select
              value={priceCurrency}
              onChange={(e) => setPriceCurrency(e.target.value)}
              className="min-w-[110px]"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </Select>
          </div>
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-2">
          <Label>Initial Stock</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="max-w-[160px]"
          />
        </div>

        {/* Attributes */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Attributes</Label>
            <button
              type="button"
              onClick={addAttribute}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#f5c518]/50 text-[#f5c518] text-xs font-medium hover:bg-[#f5c518]/15 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                width="12"
                height="12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
              Add Attribute
            </button>
          </div>
          <p className="text-[11px] text-[#4e4633] m-0">
            e.g. Size → XL, Color → Midnight Black
          </p>
          {attributes.map((attr, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                placeholder="Key (e.g. Size)"
                value={attr.key}
                onChange={(e) => updateAttribute(i, "key", e.target.value)}
              />
              <span className="text-[#9a9078] shrink-0">→</span>
              <Input
                placeholder="Value (e.g. XL)"
                value={attr.value}
                onChange={(e) => updateAttribute(i, "value", e.target.value)}
              />
              {attributes.length > 1 && (
                <IconBtn
                  danger
                  onClick={() => removeAttribute(i)}
                  title="Remove attribute"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    width="12"
                    height="12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconBtn>
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#93000a]/15 border border-[#ffb4ab]/40 rounded-lg py-3 px-4 text-[#ffb4ab] text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#f5c518] text-[#0a0a0a] rounded-lg py-3.5 px-8 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#ffe5a0] hover:shadow-[0_0_30px_rgba(245,197,24,0.4)] shadow-[0_0_20px_rgba(245,197,24,0.25)]"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin text-black/50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  fill="currentColor"
                  opacity="0.75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating…
            </>
          ) : (
            "Create Variant"
          )}
        </button>
      </form>
    </section>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const SellerProductsDetails = () => {
  const {
    handleGetProductById,
    handleUpdateVariantStock,
    handleDeleteVariant,
  } = useProduct();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProduct = async () => {
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

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleStockChange = async (variantId, stock) => {
    await handleUpdateVariantStock({ productId, variantId, stock });
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v._id === variantId ? { ...v, stock } : v,
      ),
    }));
  };

  const handleDeleteVariantClick = async (variantId) => {
    if (!window.confirm("Delete this variant? This cannot be undone.")) return;
    setDeletingId(variantId);
    try {
      await handleDeleteVariant({ productId, variantId });
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.filter((v) => v._id !== variantId),
      }));
    } catch (err) {
      console.error("Failed to delete variant:", err);
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Render: loading ── */
  if (loading) {
    return (
      <div className="bg-[#131313] min-h-screen flex items-center justify-center">
        <div className="text-center text-[#d1c5ac]">
          <svg
            className="animate-spin text-[#f5c518] mb-3 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="36"
            height="36"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeOpacity="0.25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p>Loading product…</p>
        </div>
      </div>
    );
  }

  /* ── Render: product not found ── */
  if (!product) {
    return (
      <div className="bg-[#131313] min-h-screen flex items-center justify-center text-[#d1c5ac]">
        Product not found.
      </div>
    );
  }

  const variants = product.variants ?? [];

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen pb-20">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 h-[72px] bg-[#131313]/90 backdrop-blur-md border-b border-white/10">
        <button
          onClick={() => navigate("/seller/dashboard")}
          className="flex items-center gap-2 bg-transparent border-none text-[#d1c5ac] hover:text-[#f5c518] transition-colors p-2 rounded-lg text-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            width="18"
            height="18"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Dashboard
        </button>

        <span className="font-['Playfair_Display',serif] text-[22px] font-bold text-[#f5c518] tracking-tight">
          SNITCH
        </span>

        <div className="w-[100px]" />
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-[1280px] mx-auto px-8 pt-10">
        {/* ── Product Overview Card ── */}
        <section className="flex flex-col md:flex-row gap-8 bg-[#1c1b1b] border border-white/10 rounded-2xl overflow-hidden mb-14">
          {/* Image */}
          <div className="h-[200px] md:h-full md:w-[220px] shrink-0 bg-[#2a2a2a]">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : "https://via.placeholder.com/220x260"
              }
              alt={product.title}
              className="w-full h-full md:min-h-[200px] object-cover"
            />
          </div>

          {/* Info */}
          <div className="py-7 pr-7 pl-7 md:pl-0 flex flex-col justify-center gap-3 flex-1">
            <div>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#f5c518]">
                Product
              </span>
              <h1 className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#e5e2e1] mt-1.5 leading-tight m-0">
                {product.title}
              </h1>
            </div>

            <p className="text-[#d1c5ac] text-[15px] leading-relaxed m-0 max-w-[540px]">
              {product.description}
            </p>

            <div className="flex items-center gap-6 mt-1">
              <div>
                <Label>Base Price</Label>
                <div className="font-['Playfair_Display',serif] text-2xl font-semibold text-[#f5c518] mt-0.5">
                  {currencySymbol(product.price?.currency)}
                  {product.price?.amount?.toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Variants</Label>
                <div className="mt-0.5">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full bg-[#f5c518]/15 border border-[#f5c518]/40 text-[#f5c518] text-sm font-bold">
                    {variants.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Variants Section ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <h2 className="font-['Playfair_Display',serif] text-[28px] font-bold text-[#e5e2e1] m-0">
              Product Variants
            </h2>
            <span className="bg-[#f5c518]/15 border border-[#f5c518]/40 text-[#f5c518] rounded-full px-3 py-0.5 text-[13px] font-semibold">
              {variants.length}
            </span>
          </div>

          {variants.length === 0 ? (
            <div className="text-center py-16 px-5 text-[#9a9078] bg-[#1c1b1b] border border-dashed border-[#4e4633] rounded-xl flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                width="48"
                height="48"
                className="mb-3 opacity-40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
              <p className="text-[15px] m-0">
                No variants yet. Add your first variant below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
              {variants.map((v) => (
                <div
                  key={v._id}
                  className={`transition-opacity duration-200 ${deletingId === v._id ? "opacity-40" : "opacity-100"}`}
                >
                  <VariantCard
                    variant={v}
                    productId={productId}
                    onStockChange={handleStockChange}
                    onDelete={handleDeleteVariantClick}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Add Variant Form ── */}
        <AddVariantForm productId={productId} onSuccess={fetchProduct} />
      </main>
    </div>
  );
};

export default SellerProductsDetails;
