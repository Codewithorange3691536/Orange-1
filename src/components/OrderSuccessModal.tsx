import React from 'react';
import { 
  CheckCircle2, 
  Download, 
  BookOpen, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Key, 
  FileText, 
  Tablet, 
  X,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EBOOKS_DATA } from '../data/ebooks';

export const OrderSuccessModal: React.FC = () => {
  const {
    latestOrder,
    openDashboard,
    openReader,
    downloadEbookFile,
    setViewingEmailOrder,
  } = useStore();

  if (!latestOrder) return null;

  const handleClose = () => {
    // clear latestOrder by triggering null in store via another action or simple state
    openDashboard('library');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-t-3xl text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center text-white mb-3 shadow-lg">
            <CheckCircle2 className="w-9 h-9 text-emerald-200" />
          </div>

          <h2 className="text-2xl font-black tracking-tight">Payment Successful!</h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md mx-auto">
            Order <strong className="text-white font-mono">{latestOrder.orderNumber}</strong> has been authorized.
            Your digital files are ready for immediate download.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-white">
            <Mail className="w-3.5 h-3.5" /> Sent to: {latestOrder.customerEmail}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Automated Delivery Notification Card */}
          <div className="bg-indigo-50 border border-indigo-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                <Mail className="w-4 h-4 text-indigo-600" /> Automated Delivery Email Dispatched
              </div>
              <p className="text-xs text-indigo-700 mt-0.5">
                We delivered your tokenized lifetime download links and tax invoice.
              </p>
            </div>
            <button
              onClick={() => setViewingEmailOrder(latestOrder)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Inbox Email
            </button>
          </div>

          {/* Purchased Items & Download Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Your Purchased E-Books & Download Formats
            </h3>

            <div className="space-y-4">
              {latestOrder.items.map((item) => {
                const fullEbook = EBOOKS_DATA.find((b) => b.id === item.ebookId);

                return (
                  <div
                    key={item.ebookId}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-xs"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded-xl shrink-0 border border-slate-100"
                      />

                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500">{item.author}</p>

                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1 text-indigo-600">
                            <Key className="w-3 h-3" /> License: {item.licenseKey}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Instant Download Format Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => fullEbook && downloadEbookFile(fullEbook, 'PDF', item.licenseKey)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3 h-3 text-emerald-400" /> PDF Edition
                      </button>

                      <button
                        onClick={() => fullEbook && downloadEbookFile(fullEbook, 'EPUB', item.licenseKey)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Best for Apple Books & Kobo"
                      >
                        <Tablet className="w-3 h-3 text-sky-600" /> EPUB
                      </button>

                      <button
                        onClick={() => fullEbook && downloadEbookFile(fullEbook, 'MOBI', item.licenseKey)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Amazon Kindle format"
                      >
                        <Download className="w-3 h-3 text-amber-600" /> MOBI
                      </button>

                      {fullEbook && (
                        <button
                          onClick={() => openReader(fullEbook, 0)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" /> Read Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Re-Download Anytime From Your Dashboard
            </p>
            <p className="text-[11px] text-slate-500">
              Your files have no expiration date and zero download count limits. You can access them from any computer or mobile browser anytime in your user dashboard.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => openDashboard('library')}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to My Digital Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openDashboard('orders')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
