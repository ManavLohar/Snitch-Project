import React, { useState, useRef } from "react";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router";

const MAX_IMAGES = 7;

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });
  const [images, setImages] = useState([]); // array of { file, preview }
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  /* ── handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    const selected = files.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      console.log(formData, images);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      images.forEach(({ file }) => data.append("images", file));
      await handleCreateProduct(data);
      navigate("/");
    } catch (err) {
      console.error("Create product failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── placeholder slots ── */
  const emptySlots = MAX_IMAGES - images.length - 1; // -1 for the upload button

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e2e1] antialiased">
      {/* ── Top Nav ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-20 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[#e5e2e1] hover:text-[#F5C518] transition-colors flex items-center justify-center p-2 rounded-full focus:outline-none"
          aria-label="Go back"
        >
          {/* Arrow Back SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <span
          className="text-[#F5C518] text-2xl tracking-tighter"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
        >
          SNITCH
        </span>

        {/* spacer */}
        <div className="w-9" />
      </header>

      {/* ── Main Form Canvas ── */}
      <main className="pt-28 pb-24 px-4 md:px-6 w-full max-w-[700px] mx-auto">
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1
            className="text-[#F5C518] text-3xl"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Create Product
          </h1>
          <p className="text-[#9a9078] text-sm mt-2 font-light">
            Fill in the details below to list a new product.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* ── Product Title ── */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-[#d1c5ac] text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Product Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Obsidian Silk Evening Gown"
              className="w-full bg-[#1a1a1a] text-[#e5e2e1] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-[#9a9078]"
            />
          </div>

          {/* ── Description ── */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-[#d1c5ac] text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the materials, fit, and aesthetic details..."
              className="w-full bg-[#1a1a1a] text-[#e5e2e1] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-[#9a9078] resize-y"
            />
          </div>

          {/* ── Price & Currency ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="priceAmount"
                className="text-[#d1c5ac] text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Amount
              </label>
              <input
                id="priceAmount"
                type="number"
                name="priceAmount"
                required
                min="0"
                step="0.01"
                value={formData.priceAmount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-[#1a1a1a] text-[#e5e2e1] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-[#9a9078]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="priceCurrency"
                className="text-[#d1c5ac] text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Currency
              </label>
              <div className="relative">
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] text-[#e5e2e1] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all appearance-none cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                {/* Chevron icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#9a9078]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── Product Images ── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label
                className="text-[#d1c5ac] text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Product Images
              </label>
              <span className="text-[#9a9078] text-xs">
                {images.length} / {MAX_IMAGES}
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />

            {/* Image row */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Upload button — shown only when under limit */}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 w-28 h-28 snap-start flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-[#F5C518]/40 bg-[#1a1a1a] hover:border-[#F5C518] hover:bg-[#1f1f1f] transition-all cursor-pointer group"
                >
                  {/* Camera + icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[#F5C518]/60 group-hover:text-[#F5C518] group-hover:scale-110 transition-all"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                  <span className="text-[10px] text-[#F5C518]/60 group-hover:text-[#F5C518] font-medium transition-colors">
                    Add Photo
                  </span>
                </button>
              )}

              {/* Uploaded image thumbnails */}
              {images.map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-28 h-28 snap-start relative rounded-lg overflow-hidden group border border-white/10"
                >
                  <img
                    src={img.preview}
                    alt={`Product image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3 h-3 text-white"
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

              {/* Empty placeholder slots */}
              {Array.from({
                length: Math.max(
                  0,
                  MAX_IMAGES -
                    images.length -
                    (images.length < MAX_IMAGES ? 1 : 0),
                ),
              }).map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="flex-shrink-0 w-28 h-28 snap-start rounded-lg border border-dashed border-white/15 bg-[#1a1a1a]/50 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-7 h-7 text-white/10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              ))}
            </div>

            <p className="text-[#4e4633] text-xs">
              Upload up to 7 images. First image will be the cover photo.
            </p>
          </div>

          {/* ── Submit ── */}
          <div className="mt-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5C518] text-[#0a0a0a] font-bold text-sm py-4 px-8 rounded-lg uppercase tracking-widest hover:bg-[#d4a810] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(245,197,24,0.1)] hover:shadow-[0_0_28px_rgba(245,197,24,0.25)] active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                  Creating…
                </span>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProduct;
