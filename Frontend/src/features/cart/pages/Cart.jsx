import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { useCart } from "../hook/useCart";
import { removeItem } from "../states/cart.slice";

const Cart = () => {
  const dispatch = useDispatch();
  const {
    handleIncrementCartItemQuantity,
    handleDecrementCartItemQuantity,
    handleRemoveItem,
  } = useCart();
  const cartItemsData = useSelector((state) => state.cart.items);

  const items = Array.isArray(cartItemsData[0])
    ? cartItemsData[0]
    : cartItemsData;

  const calculateSubtotal = () => {
    if (!items || items.length === 0) return 0;
    return items.reduce(
      (total, item) => total + (item.price?.amount || 0) * (item.quantity || 1),
      0,
    );
  };

  const incrementCartItem = (productId, variantId) => {
    handleIncrementCartItemQuantity({ productId, variantId });
  };

  const decrementCartItem = (productId, variantId) => {
    handleDecrementCartItemQuantity({ productId, variantId });
  };

  const removeItemFromCart = (productId, variantId) => {
    handleRemoveItem({
      productId,
      variantId,
    });
  };

  const subtotal = calculateSubtotal();
  const shipping = 0; // Complimentary shipping
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#e5e2e1] pb-12 md:pb-20 md:pt-28 px-4 sm:px-8 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-12 tracking-tight text-white">
          Shopping Bag
        </h1>

        {!items || items.length === 0 ? (
          <div className="text-center py-24 bg-[#1A1A1A] rounded-2xl border border-white/5">
            <h2 className="text-2xl font-['Playfair_Display'] mb-4 text-white">
              Your bag is currently empty.
            </h2>
            <p className="text-[#a1a1aa] mb-8 max-w-md mx-auto">
              Discover our latest collections and elevate your style with
              premium selections.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#F5C518] text-[#0A0A0A] px-10 py-4 rounded-lg font-semibold hover:bg-[#ffe5a0] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Cart Items List */}
            <div className="flex-1">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-white/10 text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-8">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="space-y-6">
                {items.map((item) => {
                  const product = item.product;
                  const variantInfo = product?.variants?.find(
                    (v) => v._id === item.variant,
                  );
                  const variantPrice = variantInfo?.price;
                  const displayImage =
                    variantInfo?.images?.[0]?.url || product?.images?.[0]?.url;

                  return (
                    <div
                      key={item._id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 bg-[#1A1A1A] rounded-2xl border border-white/5 group transition-colors hover:border-white/10"
                    >
                      {/* Product Details */}
                      <div className="col-span-1 md:col-span-6 flex gap-6 items-start">
                        <div className="w-24 h-32 md:w-28 md:h-36 shrink-0 bg-[#0A0A0A] overflow-hidden rounded-lg border border-white/5">
                          <img
                            src={displayImage}
                            alt={product?.title || "Product Image"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col h-full justify-between py-1">
                          <div>
                            <h3 className="font-['Playfair_Display'] text-lg md:text-xl font-semibold mb-2 text-white">
                              {product?.title}
                            </h3>
                            {variantInfo?.attributes && (
                              <div className="text-sm text-[#a1a1aa] space-y-1.5">
                                {Object.entries(variantInfo.attributes).map(
                                  ([key, value]) => (
                                    <p key={key} className="flex gap-2">
                                      <span className="opacity-60 w-12">
                                        {key}:
                                      </span>
                                      <span className="text-[#d1c5ac]">
                                        {value}
                                      </span>
                                    </p>
                                  ),
                                )}
                              </div>
                            )}
                          </div>

                          {variantPrice.amount !== item.price.amount &&
                          variantPrice.amount > item.price.amount ? (
                            <p className="font-bold tracking-wider uppercase text-xs text-red-400 mt-2">
                              This product will cost you {variantPrice.currency}{" "}
                              {variantPrice.amount - item.price.amount} more
                            </p>
                          ) : variantPrice.amount < item.price.amount ? (
                            <p className="font-bold tracking-wider uppercase text-xs text-green-400 mt-2">
                              You will get this at {variantPrice.currency}{" "}
                              {variantPrice.amount} save{" "}
                              {item.price.amount - variantPrice.amount}
                            </p>
                          ) : (
                            ""
                          )}

                          <button
                            onClick={() =>
                              removeItemFromCart(
                                item?.product._id,
                                item?.variant,
                              )
                            }
                            className="text-sm text-[#e5e2e1]/60 hover:text-red-400 w-fit mt-6 flex items-center gap-1.5 transition-colors uppercase tracking-wider font-medium text-[11px]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center items-center mt-2 md:mt-0">
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#0A0A0A]">
                          <button
                            onClick={() =>
                              decrementCartItem(
                                item?.product._id,
                                item?.variant,
                              )
                            }
                            className="px-3.5 py-1.5 hover:bg-white/10 transition-colors text-lg text-[#a1a1aa] hover:text-white"
                          >
                            −
                          </button>
                          <span className="px-3 py-1.5 font-medium text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              incrementCartItem(
                                item?.product._id,
                                item?.variant,
                              )
                            }
                            className="px-3.5 py-1.5 hover:bg-white/10 transition-colors text-lg text-[#a1a1aa] hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="hidden md:flex col-span-2 justify-end items-center">
                        <span className="text-[#a1a1aa] font-['Playfair_Display'] text-lg">
                          {item.price?.currency}{" "}
                          {item.price?.amount?.toLocaleString()}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-0">
                        <span className="md:hidden text-[#a1a1aa] uppercase text-[11px] font-semibold tracking-wider">
                          Total
                        </span>
                        <span className="font-['Playfair_Display'] text-xl font-bold text-[#f5c518]">
                          {item.price?.currency}{" "}
                          {(
                            item.price?.amount * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 sticky top-8">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-8 text-white">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a1a1aa]">Subtotal</span>
                    <span className="font-medium text-[#e5e2e1]">
                      INR {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a1a1aa]">Shipping</span>
                    <span className="font-medium text-[#f5c518]">
                      {shipping === 0
                        ? "Complimentary"
                        : `INR ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a1a1aa]">Taxes</span>
                    <span className="font-medium text-[#e5e2e1]">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-medium text-white">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="font-['Playfair_Display'] text-3xl font-bold text-[#f5c518] block">
                        INR {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#F5C518] text-[#0A0A0A] py-4 rounded-lg font-semibold text-[15px] tracking-wide hover:bg-[#ffe5a0] transition-colors flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(245,197,24,0.1)]">
                  PROCEED TO CHECKOUT
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>

                <div className="flex items-center justify-center gap-2 mt-6 text-[#a1a1aa] text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Secure, encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
