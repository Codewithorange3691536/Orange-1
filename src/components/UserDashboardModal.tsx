import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  History, 
  Heart, 
  Settings, 
  Download, 
  ExternalLink, 
  RotateCcw, 
  CheckCircle2, 
  Key, 
  ShoppingBag, 
  Tablet, 
  FileText, 
  ShieldCheck,
  Mail,
  Trash2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EBOOKS_DATA } from '../data/ebooks';

export const UserDashboardModal: React.FC = () => {
  const {
    isDashboardOpen,
    closeDashboard,
    dashboardInitialTab,
    orders,
    favorites,
    libraryEbookIds,
    toggleFavorite,
    addToCart,
    openReader,
    downloadEbookFile,
    setViewingEmailOrder,
    requestRefund,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'library' | 'orders' | 'favorites' | 'settings'>(
    dashboardInitialTab || 'library'
  );

  // Sync with initial tab when opening
  React.useEffect(() => {
    if (dashboardInitialTab) {
      setActiveTab(dashboardInitialTab);
    }
  }, [dashboardInitialTab]);

  if (!isDashboardOpen) return null;

  // Derive favorite ebooks
  const favoriteEbooks = EBOOKS_DATA.filter((b) => favorites.includes(b.id));

  // Derive library ebooks
  const libraryEbooks = EBOOKS_DATA.filter((b) => libraryEbookIds.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dashboard Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Reader Dashboard &amp; Digital Library</h2>
              <p className="text-xs text-slate-400">
                Manage your purchased titles, download links, orders, and favorites
              </p>
            </div>
          </div>

          <button
            onClick={closeDashboard}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 sm:px-6 bg-slate-50 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'library'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Library</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {libraryEbooks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Order History</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist &amp; Favorites</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {favoriteEbooks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings &amp; Support</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* TAB 1: MY LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your Active Digital Bookshelf</h3>
                  <p className="text-xs text-slate-500">
                    Instant in-browser reading with zero storage usage, or download offline formats anytime.
                  </p>
                </div>
              </div>

              {libraryEbooks.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900">No Purchased Ebooks Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Browse our student guides and business playbooks. Every ebook comes with instant lifetime downloads!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {libraryEbooks.map((book) => (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between shadow-xs"
                    >
                      <div className="flex gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-16 h-22 object-cover rounded-xl border border-slate-100 shrink-0"
                        />
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {book.category}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-2 mt-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{book.author.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">
                            {book.pages} pages • {book.fileSize}
                          </p>
                        </div>
                      </div>

                      {/* Download & Reading buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        <button
                          onClick={() => openReader(book, 0)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Read in Browser
                        </button>

                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          <button
                            onClick={() => downloadEbookFile(book, 'PDF')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                          >
                            <Download className="w-3 h-3 text-emerald-600" /> PDF
                          </button>
                          <button
                            onClick={() => downloadEbookFile(book, 'EPUB')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                          >
                            <Tablet className="w-3 h-3 text-sky-600" /> EPUB
                          </button>
                          <button
                            onClick={() => downloadEbookFile(book, 'MOBI')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                          >
                            <Download className="w-3 h-3 text-amber-600" /> Kindle
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Complete Transaction History</h3>
                <p className="text-xs text-slate-500">
                  Track invoices, tokenized download links, and verified order receipts.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <History className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No past transactions found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-slate-900">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.paymentStatus === 'paid'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {order.paymentStatus === 'paid' ? 'Paid & Delivered' : 'Refunded'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {order.date} • Paid via {order.paymentMethod}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingEmailOrder(order)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5 text-indigo-600" /> View Email Receipt
                          </button>

                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl" title="Digital products are non-refundable once delivered.">
                            Sales Final
                          </span>
                        </div>
                      </div>

                      {/* Items inside order */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.ebookId} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="font-semibold text-slate-800">{item.title}</span>
                              <span className="text-slate-400 hidden sm:inline">({item.author})</span>
                            </div>
                            <span className="font-mono font-medium text-slate-700">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>Total Paid:</span>
                        <span className="text-indigo-600 font-mono text-sm">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITES & WISHLIST */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Saved Ebooks</h3>
                <p className="text-xs text-slate-500">
                  Keep track of digital titles to purchase later.
                </p>
              </div>

              {favoriteEbooks.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Heart className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">You haven&apos;t saved any ebooks yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteEbooks.map((book) => (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded-lg border border-slate-100 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">{book.title}</h4>
                          <p className="text-xs text-slate-500">{book.author.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-xs font-mono text-slate-900">
                              ${book.price.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through font-mono">
                              ${book.originalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => addToCart(book)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                        </button>
                        <button
                          onClick={() => toggleFavorite(book.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS & POLICIES */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital Rights &amp; Copyright Policy
                </h4>
                <p className="leading-relaxed text-slate-600">
                  All digital ebooks purchased through MNSID Digital Solutions are legally licensed personal copies with zero intrusive DRM locks. You have irrevocable rights to read them across your personal devices (smartphones, tablets, Kindle, computers) without arbitrary copy expiration.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Digital Products: Strict No-Refund Policy
                </h4>
                <p className="leading-relaxed text-slate-600">
                  Because digital e-books and direct download links are delivered instantly and DRM-free upon payment authorization, all digital sales are final and strictly non-refundable. To ensure you find the perfect title, we provide comprehensive free sample chapters and full tables of contents via our &quot;Look Inside&quot; reader before purchase.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-600" /> Delivery Email Verification
                </h4>
                <p className="text-slate-600">
                  Lost access to your primary email address? Enter your replacement email below to sync your entire digital bookshelf:
                </p>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter email to re-sync..."
                    defaultValue="alex.reader@example.com"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => showToast('Re-sync email verified! Download tokens refreshed.', 'success')}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl font-semibold cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
