import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AVAILABLE_COUPONS } from '../data/ebooks';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    activeCoupon,
    appliedCouponCode,
    applyCoupon,
    removeCoupon,
    couponError,
    openCheckout,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput.trim());
    if (ok) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Your Cart</h2>
              <p className="text-xs text-slate-500">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for instant delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Your cart is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our catalog for student-friendly guides and high-growth entrepreneur playbooks.
              </p>
              <button
                onClick={closeCart}
                className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
              >
                Browse All Ebooks
              </button>
            </div>
          ) : (
            cart.map(({ ebook }) => (
              <div
                key={ebook.id}
                className="p-3 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-200 transition-all flex gap-3 shadow-xs"
              >
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="w-16 h-20 object-cover rounded-xl shrink-0 border border-slate-100"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {ebook.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(ebook.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">{ebook.author.name}</p>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        PDF • EPUB • MOBI
                      </span>
                      <span>•</span>
                      <span>{ebook.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-100">
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Instant Access
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ${ebook.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        ${ebook.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Coupons & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-4">
            {/* Coupon Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter discount code..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}

              {/* Active Coupon Badge */}
              {activeCoupon && (
                <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong>{appliedCouponCode}</strong> applied ({activeCoupon.discountPercent}% OFF)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-rose-600 hover:underline cursor-pointer font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Quick clickable coupon suggestions */}
              {!activeCoupon && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500">Quick codes:</span>
                  {AVAILABLE_COUPONS.map((cp) => (
                    <button
                      key={cp.code}
                      onClick={() => applyCoupon(cp.code)}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-bold cursor-pointer text-[10px] transition-colors"
                      title={cp.description}
                    >
                      {cp.code} ({cp.discountPercent}%)
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({activeCoupon?.code}):</span>
                  <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-extrabold text-base pt-1 border-t border-slate-200">
                <span>Total Due:</span>
                <span className="font-mono text-indigo-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Seal Note */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-600" /> Digital Sales Final
              </span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={openCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
