import React from 'react';
import { 
  X, 
  Mail, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Printer, 
  Tablet, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EBOOKS_DATA } from '../data/ebooks';

export const EmailDeliveryModal: React.FC = () => {
  const { viewingEmailOrder, setViewingEmailOrder, downloadEbookFile, showToast } = useStore();

  if (!viewingEmailOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Email Client Top Bar */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            <span className="text-xs font-semibold text-slate-500 ml-2">
              Automated Email Delivery Simulator
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>
            <button
              onClick={() => setViewingEmailOrder(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Header Info */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 text-xs text-slate-700 space-y-1.5 font-sans">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-slate-400 font-medium">From: </span>
              <strong className="text-slate-900">MNSID Digital Solutions</strong>{' '}
              <span className="text-slate-500">&lt;delivery@mnsid-digital.example.com&gt;</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{viewingEmailOrder.date}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium">To: </span>
            <span className="text-slate-900 font-medium">{viewingEmailOrder.customerName}</span>{' '}
            <span className="text-slate-500">&lt;{viewingEmailOrder.customerEmail}&gt;</span>
          </div>

          <div className="pt-1">
            <span className="text-slate-400 font-medium">Subject: </span>
            <strong className="text-slate-900">
              Your MNSID Digital E-Books Order #{viewingEmailOrder.orderNumber} &amp; Secure Download Links
            </strong>
          </div>
        </div>

        {/* Rendered Email Body */}
        <div className="p-6 sm:p-8 space-y-6 font-sans">
          {/* Email Company Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                MNSID <span className="text-indigo-600 text-sm font-semibold uppercase">Digital Solutions</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Digital Publication &amp; Licensed E-Book Delivery
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Order Paid &amp; Verified
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Receipt: {viewingEmailOrder.receiptNumber}
              </p>
            </div>
          </div>

          {/* Greeting */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <p>Hello <strong>{viewingEmailOrder.customerName}</strong>,</p>
            <p>
              Thank you for purchasing through MNSID Digital Solutions. Your digital e-book files have been compiled, assigned a verified digital licensing key, and are ready for instant download below.
            </p>
          </div>

          {/* Items & Direct Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Purchased Titles &amp; Tokenized Downloads
            </h4>

            {viewingEmailOrder.items.map((item) => {
              const fullEbook = EBOOKS_DATA.find((b) => b.id === item.ebookId);

              return (
                <div
                  key={item.ebookId}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{item.title}</h5>
                      <p className="text-xs text-slate-500">By {item.author}</p>
                      <p className="text-[11px] text-indigo-700 font-mono mt-1">
                        License Key: <strong>{item.licenseKey}</strong>
                      </p>
                    </div>
                    <span className="font-bold text-sm text-slate-900 font-mono">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Multi-Format Direct Download Buttons inside email */}
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => fullEbook && downloadEbookFile(fullEbook, 'PDF', item.licenseKey)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF ({item.fileSize})
                    </button>

                    <button
                      onClick={() => fullEbook && downloadEbookFile(fullEbook, 'EPUB', item.licenseKey)}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Tablet className="w-3.5 h-3.5 text-sky-600" /> EPUB (Apple Books)
                    </button>

                    <button
                      onClick={() => fullEbook && downloadEbookFile(fullEbook, 'MOBI', item.licenseKey)}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600" /> MOBI (Kindle)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Financial Invoice Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">${viewingEmailOrder.subtotal.toFixed(2)}</span>
            </div>
            {viewingEmailOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discounts applied:</span>
                <span className="font-mono">-${viewingEmailOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
              <span>Total Paid ({viewingEmailOrder.paymentMethod}):</span>
              <span className="font-mono text-indigo-600">${viewingEmailOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Compatibility Instructions */}
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 space-y-1.5">
            <p className="font-bold text-slate-700">How to load on your reading devices:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li><strong>Kindle:</strong> Attach the MOBI/EPUB file to an email and send to your Send-to-Kindle address.</li>
              <li><strong>iPhone / iPad:</strong> Tap the EPUB download button, tap Share, and select &quot;Open in Books&quot;.</li>
              <li><strong>Android:</strong> Open file with Google Play Books, Moon+ Reader, or ReadEra.</li>
              <li><strong>Any Web Browser:</strong> Log in to your MNSID User Dashboard to read online with zero storage footprint.</li>
            </ul>
          </div>

          {/* Digital Goods Final Sale Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Strict No-Refund Policy (Digital Downloads)</p>
              <p className="text-[11px] mt-0.5 text-amber-800">
                Because digital goods and license tokens are delivered instantly and permanently upon checkout, all digital sales are final and non-refundable. Thank you for supporting authorized authors.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400 rounded-b-3xl">
          MNSID Digital Solutions • All Rights Reserved • Automated Transaction ID: {viewingEmailOrder.id}
        </div>
      </div>
    </div>
  );
};
