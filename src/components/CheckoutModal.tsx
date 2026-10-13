import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ArrowLeft,
  Mail,
  User,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    activeCoupon,
    isCheckoutOpen,
    closeCheckout,
    completeCheckout,
  } = useStore();

  const [customerName, setCustomerName] = useState('Alex Reader');
  const [customerEmail, setCustomerEmail] = useState('alex.reader@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay' | 'googlepay'>('card');
  
  // Card inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  if (!isCheckoutOpen || cart.length === 0) return null;

  const handleFillDemoData = () => {
    setCustomerName('Jordan Taylor');
    setCustomerEmail('jordan.student@university.edu');
    setCardNumber('4000 1234 5678 9010');
    setCardExpiry('08/29');
    setCardCvc('321');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) return;

    setIsProcessing(true);
    setProcessingStep('Connecting to secure 256-bit payment gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing payment method & verifying zero fraud...');
    }, 700);

    setTimeout(() => {
      setProcessingStep('Generating unique digital license keys & watermarking files...');
    }, 1400);

    setTimeout(() => {
      // Complete order in store
      completeCheckout(customerName, customerEmail, paymentMethod.toUpperCase());
      setIsProcessing(false);

      // Fire festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 2100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Secure Express Checkout
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted • Zero Payment Failure Guarantee
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing Overlay if in progress */}
        {isProcessing ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            <h3 className="text-lg font-bold text-slate-900">Processing Your Digital Order</h3>
            <p className="text-xs text-indigo-600 font-semibold animate-pulse">{processingStep}</p>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Please do not close this window. Your download link and email receipt are being generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="p-6 sm:p-8 space-y-6">
            {/* Quick Demo Fill button for seamless user testing */}
            <div className="bg-indigo-50 border border-indigo-200/80 p-3 rounded-2xl flex items-center justify-between text-xs text-indigo-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Want to test quickly? Auto-fill verified test credentials.</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemoData}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
              >
                1-Click Test Fill
              </button>
            </div>

            {/* Customer Delivery Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-600" /> Customer Information & Automated Delivery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (For Instant Delivery)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your secure download token and receipt will be dispatched here immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Select Payment Method
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'applepay'
                      ? 'bg-slate-900 border-slate-900 text-white ring-2 ring-slate-900/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold"> Apple Pay</span>
                  <span className="text-[10px] opacity-75">1-Touch Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'googlepay'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-blue-600">G Pay</span>
                  <span className="text-[10px] opacity-75">Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-amber-700">PayPal</span>
                  <span className="text-[10px] opacity-75">Buyer Protection</span>
                </button>
              </div>

              {/* Card inputs (if card selected) */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Security CVC / CVV
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Order Items ({cart.length})</h4>
              <div className="space-y-1.5 text-xs">
                {cart.map(({ ebook }) => (
                  <div key={ebook.id} className="flex justify-between text-slate-600">
                    <span className="truncate max-w-[320px]">{ebook.title}</span>
                    <span className="font-mono font-medium">${ebook.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 mt-3 pt-3 space-y-1 text-xs">
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({activeCoupon?.code}):</span>
                    <span>-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                  <span>Total Due Today:</span>
                  <span className="text-indigo-600 font-mono">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Complete Order & Get Instant Download (${cartTotal.toFixed(2)})</span>
            </button>

            {/* Digital sales final policy notice */}
            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              Digital Goods Notice: Strict No-Refund Policy upon file delivery. Free sample excerpts available via Look Inside.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
