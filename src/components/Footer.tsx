import React, { useState } from 'react';
import { 
  BookOpen, 
  Mail, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Heart,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const {
    setSelectedAudience,
    openDashboard,
    openSupport,
    applyCoupon,
    showToast,
  } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSubscribed(true);
    applyCoupon('MNSID20');
    showToast('Subscribed! Welcome code "MNSID20" (20% OFF) has been applied to your cart!', 'success');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      {/* Upper Newsletter & Discount Box */}
      <div className="border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-white font-bold text-base sm:text-lg">
              Get 20% Off Your First Digital E-Book
            </h3>
            <p className="text-slate-400 mt-1 text-xs">
              Subscribe to our monthly curated reading digest for new releases, author interviews, and exclusive discounts.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {isSubscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You&apos;re subscribed! Coupon &quot;MNSID20&quot; is ready in your cart.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <span>Claim 20%</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-base">MNSID Digital Solutions</span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Empowering students, ambitious beginners, and high-growth entrepreneurs with verified, actionable digital knowledge. 
            Instant downloads, interactive sample reading, and zero payment risk.
          </p>

          <div className="flex items-center gap-3 pt-2 text-slate-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Digital Sales Final
            </span>
          </div>
        </div>

        {/* Col 2: Target Audiences */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Audiences
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setSelectedAudience('students');
                  applyCoupon('STUDENT20');
                }}
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center justify-between w-full"
              >
                <span>Students &amp; Beginners (16–24)</span>
                <span className="text-amber-400 font-bold text-[10px]">20% off</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSelectedAudience('professionals');
                  applyCoupon('GROWTH20');
                }}
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center justify-between w-full"
              >
                <span>Professionals &amp; Founders (25–40)</span>
                <span className="text-emerald-400 font-bold text-[10px]">20% off</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => applyCoupon('STUDENT20')}
                className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer text-left"
              >
                Student 20% Discount (STUDENT20)
              </button>
            </li>
            <li>
              <button
                onClick={() => applyCoupon('GROWTH20')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer text-left"
              >
                Founder Bundle Code (GROWTH20)
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Portal */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Reader Portal
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => openDashboard('library')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                My Digital Library
              </button>
            </li>
            <li>
              <button
                onClick={() => openDashboard('orders')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Order History &amp; Receipts
              </button>
            </li>
            <li>
              <button
                onClick={() => openDashboard('favorites')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Saved Wishlist
              </button>
            </li>
            <li>
              <button
                onClick={openSupport}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Send-to-Kindle Instructions
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust & Support */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Trust &amp; Guarantees
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={openSupport}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Help Desk &amp; FAQs</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => openDashboard('settings')}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Strict No-Refund Policy</span>
              </button>
            </li>
            <li>
              <span className="text-slate-400">
                DRM-Free Licensed Personal Copies
              </span>
            </li>
            <li>
              <span className="text-slate-400">
                Support: support@mnsid-digital.example.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MNSID Digital Solutions. All Rights Reserved. Clean, accessible e-commerce for digital readers.</p>
          <div className="flex items-center gap-4">
            <button onClick={openSupport} className="hover:text-slate-300">Privacy Policy</button>
            <span>•</span>
            <button onClick={openSupport} className="hover:text-slate-300">Terms of Service</button>
            <span>•</span>
            <button onClick={() => openDashboard('settings')} className="hover:text-slate-300">No-Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
