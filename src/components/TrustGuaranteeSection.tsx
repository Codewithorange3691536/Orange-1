import React from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Smartphone, 
  Lock, 
  Eye, 
  FileCheck2, 
  MailCheck, 
  Sparkles,
  Award,
  CreditCard,
  Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrustGuaranteeSection: React.FC = () => {
  const { openSupport, applyCoupon } = useStore();

  const trustCards = [
    {
      icon: ShieldCheck,
      iconColor: 'text-amber-600 bg-amber-50',
      title: 'Strict No-Refund Policy (Digital Downloads)',
      desc: 'Because our digital e-books are delivered immediately with DRM-free lifetime access, all sales are final upon purchase. We provide interactive "Look Inside" previews for every title so you can inspect the quality before buying.',
    },
    {
      icon: Eye,
      iconColor: 'text-indigo-500 bg-indigo-50',
      title: 'Interactive Free Sample Previews',
      desc: 'Never buy blind. Use our in-browser "Look Inside" reader to inspect full chapter excerpts, table of contents, and real formatting before paying.',
    },
    {
      icon: Smartphone,
      iconColor: 'text-sky-500 bg-sky-50',
      title: 'Universal Multi-Device Compatibility',
      desc: 'Every title includes PDF, EPUB, and MOBI formats. Reads effortlessly on Kindle Paperwhite, Apple Books (iPad/iPhone), Android, and PC/Mac.',
    },
    {
      icon: Lock,
      iconColor: 'text-purple-500 bg-purple-50',
      title: '256-Bit SSL Encrypted Checkout',
      desc: 'Bank-grade PCI-DSS Level 1 payment protection. Support for Credit/Debit Cards, Apple Pay, Google Pay, and PayPal with zero hidden fees.',
    },
    {
      icon: MailCheck,
      iconColor: 'text-amber-500 bg-amber-50',
      title: 'Instant Automated Email Delivery',
      desc: 'Receive immediate access links and PDF/EPUB attachments in your inbox. Download anytime without worrying about link expiration or lost files.',
    },
    {
      icon: FileCheck2,
      iconColor: 'text-teal-500 bg-teal-50',
      title: 'DRM-Free Legal Licensing',
      desc: 'All publications are officially licensed through MNSID Digital Solutions. No intrusive DRM locks—your personal copy belongs to you for life.',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>The MNSID Reader Assurance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Clear, Transparent Digital E-Book Delivery
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            From comprehensive sample previews to multi-device compatibility and instant tokenized delivery, our store provides complete clarity.
          </p>
        </div>

        {/* 6 Guarantee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Student & Founder Assistance Banner with 20% Deals */}
        <div className="mt-12 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-2">
              EXCLUSIVE 20% DISCOUNT PROGRAM
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              High learning costs shouldn&apos;t block your ambition.
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200 mt-2 leading-relaxed">
              Students &amp; Beginners (16–24) get 20% off with coupon <strong className="text-white underline decoration-amber-400 font-mono">STUDENT20</strong>. Professionals &amp; Founders (25–40) get 20% off with coupon <strong className="text-white underline decoration-emerald-400 font-mono">GROWTH20</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => applyCoupon('STUDENT20')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Apply STUDENT20 (20%)
            </button>
            <button
              onClick={() => applyCoupon('GROWTH20')}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Apply GROWTH20 (20%)
            </button>
            <button
              onClick={openSupport}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer border border-white/20"
            >
              Help Desk
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
