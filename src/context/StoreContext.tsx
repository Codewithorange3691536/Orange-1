import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ebook, CartItem, Order, OrderItem, Coupon, AudienceType, BookFormat } from '../types';
import { EBOOKS_DATA, AVAILABLE_COUPONS } from '../data/ebooks';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  ebooks: Ebook[];
  cart: CartItem[];
  favorites: string[]; // ebook IDs
  orders: Order[];
  libraryEbookIds: string[];
  selectedAudience: AudienceType;
  selectedCategory: string;
  searchQuery: string;
  activeCoupon: Coupon | null;
  appliedCouponCode: string;
  couponError: string | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isDashboardOpen: boolean;
  isSupportOpen: boolean;
  dashboardInitialTab: 'library' | 'orders' | 'favorites' | 'settings';
  previewingEbook: Ebook | null;
  readingEbook: Ebook | null;
  readingChapterIndex: number;
  latestOrder: Order | null;
  viewingEmailOrder: Order | null;
  toasts: Toast[];

  // Actions
  setSelectedAudience: (audience: AudienceType) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  addToCart: (ebook: Ebook, format?: BookFormat) => void;
  removeFromCart: (ebookId: string) => void;
  clearCart: () => void;
  toggleFavorite: (ebookId: string) => void;
  isFavorite: (ebookId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openDashboard: (tab?: 'library' | 'orders' | 'favorites' | 'settings') => void;
  closeDashboard: () => void;
  openSupport: () => void;
  closeSupport: () => void;
  openPreview: (ebook: Ebook) => void;
  closePreview: () => void;
  openReader: (ebook: Ebook, chapterIndex?: number) => void;
  closeReader: () => void;
  setReadingChapterIndex: (index: number) => void;
  completeCheckout: (customerName: string, customerEmail: string, paymentMethod: string) => Order;
  requestRefund: (orderId: string, ebookId: string) => void;
  downloadEbookFile: (ebook: Ebook, format: BookFormat, licenseKey?: string) => void;
  setViewingEmailOrder: (order: Order | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Computed values
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  cartCount: number;
  filteredEbooks: Ebook[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_FAVORITES = 'mnsid_ebook_favorites_v1';
const LOCAL_STORAGE_KEY_ORDERS = 'mnsid_ebook_orders_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ebooks] = useState<Ebook[]>(EBOOKS_DATA);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : ['ebook-ai-students', 'ebook-high-converting-store'];
    } catch {
      return ['ebook-ai-students', 'ebook-high-converting-store'];
    }
  });

  // Pre-seed an initial demo order so user can explore their dashboard immediately!
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const initialOrder: Order = {
      id: 'ord-demo-84920',
      orderNumber: 'MNSID-2026-8492',
      date: new Date(Date.now() - 3600 * 1000 * 24 * 3).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerEmail: 'student.reader@campus.edu',
      customerName: 'Alex Reader',
      items: [
        {
          ebookId: 'ebook-ai-students',
          title: 'Modern AI & Prompt Engineering for Students',
          author: 'Dr. Ryan Alistair',
          price: 24.99,
          coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
          fileSize: '8.4 MB',
          licenseKey: 'MNSID-LIC-AI-84920-VERIFIED',
          downloadCount: 3,
        }
      ],
      subtotal: 24.99,
      discount: 0,
      total: 24.99,
      paymentMethod: 'Apple Pay',
      paymentStatus: 'paid',
      deliveryStatus: 'delivered',
      downloadToken: 'tok_sec_9938d9f1a8e2',
      tokenExpiresAt: 'Lifetime Unrestricted Access',
      receiptNumber: 'RCP-MNSID-8492',
    };
    return [initialOrder];
  });

  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [dashboardInitialTab, setDashboardInitialTab] = useState<'library' | 'orders' | 'favorites' | 'settings'>('library');

  const [previewingEbook, setPreviewingEbook] = useState<Ebook | null>(null);
  const [readingEbook, setReadingEbook] = useState<Ebook | null>(null);
  const [readingChapterIndex, setReadingChapterIndex] = useState<number>(0);

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [viewingEmailOrder, setViewingEmailOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Library ebook IDs derived from all paid orders
  const libraryEbookIds = Array.from(
    new Set(
      orders
        .filter((ord) => ord.paymentStatus === 'paid')
        .flatMap((ord) => ord.items.map((item) => item.ebookId))
    )
  );

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (ebook: Ebook, format: BookFormat = 'PDF') => {
    if (cart.some((item) => item.ebook.id === ebook.id)) {
      showToast(`"${ebook.title}" is already in your cart!`, 'info');
      setIsCartOpen(true);
      return;
    }

    setCart((prev) => [...prev, { ebook, selectedFormat: format }]);
    showToast(`Added "${ebook.title}" to cart!`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (ebookId: string) => {
    setCart((prev) => prev.filter((item) => item.ebook.id !== ebookId));
    showToast('Removed item from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (ebookId: string) => {
    if (favorites.includes(ebookId)) {
      setFavorites((prev) => prev.filter((id) => id !== ebookId));
      showToast('Removed from your favorites', 'info');
    } else {
      setFavorites((prev) => [...prev, ebookId]);
      showToast('Added to your favorites!', 'success');
    }
  };

  const isFavorite = (ebookId: string) => favorites.includes(ebookId);

  const applyCoupon = (code: string): boolean => {
    let cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'STUDENT50') cleanCode = 'STUDENT20';
    if (cleanCode === 'GROWTH30') cleanCode = 'GROWTH20';
    setCouponError(null);

    const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      setCouponError(`Coupon "${cleanCode}" is invalid or expired.`);
      showToast(`Invalid coupon code "${cleanCode}".`, 'error');
      return false;
    }

    if (found.minAmount && cartSubtotal < found.minAmount) {
      setCouponError(`This coupon requires a minimum subtotal of $${found.minAmount.toFixed(2)}.`);
      showToast(`Minimum order of $${found.minAmount} required for ${cleanCode}.`, 'warning');
      return false;
    }

    setActiveCoupon(found);
    setAppliedCouponCode(cleanCode);
    showToast(`Coupon applied! ${found.discountPercent}% discount saved.`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setAppliedCouponCode('');
    setCouponError(null);
    showToast('Coupon removed.', 'info');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openDashboard = (tab: 'library' | 'orders' | 'favorites' | 'settings' = 'library') => {
    setDashboardInitialTab(tab);
    setIsDashboardOpen(true);
  };
  const closeDashboard = () => setIsDashboardOpen(false);

  const openSupport = () => setIsSupportOpen(true);
  const closeSupport = () => setIsSupportOpen(false);

  const openPreview = (ebook: Ebook) => setPreviewingEbook(ebook);
  const closePreview = () => setPreviewingEbook(null);

  const openReader = (ebook: Ebook, chapterIndex: number = 0) => {
    setReadingEbook(ebook);
    setReadingChapterIndex(chapterIndex);
  };
  const closeReader = () => {
    setReadingEbook(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.ebook.price, 0);
  const cartDiscount = activeCoupon
    ? Number(((cartSubtotal * activeCoupon.discountPercent) / 100).toFixed(2))
    : 0;
  const cartTotal = Math.max(0, Number((cartSubtotal - cartDiscount).toFixed(2)));
  const cartCount = cart.length;

  const completeCheckout = (
    customerName: string,
    customerEmail: string,
    paymentMethod: string
  ): Order => {
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const orderNumber = `MNSID-${new Date().getFullYear()}-${randomHex}`;
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const orderItems: OrderItem[] = cart.map((cartItem) => {
      const ebook = cartItem.ebook;
      const licenseSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      return {
        ebookId: ebook.id,
        title: ebook.title,
        author: ebook.author.name,
        price: ebook.price,
        coverImage: ebook.coverImage,
        formats: ebook.formats,
        fileSize: ebook.fileSize,
        licenseKey: `MNSID-LIC-${ebook.id.substring(6, 12).toUpperCase()}-${licenseSuffix}`,
        downloadCount: 0,
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateFormatted,
      customerEmail: customerEmail.trim(),
      customerName: customerName.trim(),
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      total: cartTotal,
      paymentMethod,
      paymentStatus: 'paid',
      deliveryStatus: 'delivered',
      downloadToken: `tok_sec_${Math.random().toString(36).substring(2, 12)}`,
      tokenExpiresAt: 'Lifetime Unrestricted Access (256-bit Encrypted)',
      receiptNumber: `RCP-${orderNumber}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);

    showToast(`Order confirmed! Automated delivery email dispatched to ${customerEmail}.`, 'success');
    return newOrder;
  };

  const requestRefund = (orderId: string, _ebookId: string) => {
    showToast('Strict No-Refund Policy: Digital downloads and license keys are non-refundable once issued.', 'warning');
  };

  // Secure instant download generator
  const downloadEbookFile = (ebook: Ebook, format: BookFormat, licenseKey?: string) => {
    const activeLicense = licenseKey || `MNSID-LIC-${ebook.id.toUpperCase()}-INSTANT`;
    const safeTitle = ebook.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    // We create a clean, formatted text file representing the digital e-book bundle package
    const fileContent = `================================================================================
MNSID DIGITAL SOLUTIONS - VERIFIED DIGITAL E-BOOK EDITION
================================================================================

TITLE: ${ebook.title}
SUBTITLE: ${ebook.subtitle}
AUTHOR: ${ebook.author.name} (${ebook.author.role})
CATEGORY: ${ebook.category}
ISBN / DIGITAL REGISTRATION: ${ebook.isbn}
PUBLICATION YEAR: ${ebook.publicationYear}
PAGES: ${ebook.pages} pages
FORMAT: ${format} Edition
DIGITAL LICENSE KEY: ${activeLicense}
VERIFIED PURCHASER SECURITY HASH: SHA256-${Math.random().toString(36).substring(2, 14).toUpperCase()}
AUTHENTICITY STATUS: Legally Authorized DRM-Free Personal Copy

--------------------------------------------------------------------------------
LEGAL & USAGE NOTICE:
This digital book is officially licensed through MNSID Digital Solutions.
You have lifetime personal reading rights across all your devices (Kindle, iPad,
Android, PC/Mac). Resale, unauthorized redistribution, or bulk pirating is
strictly prohibited by copyright law.
--------------------------------------------------------------------------------

TABLE OF CONTENTS:
${ebook.chapters.map((ch) => `  * ${ch.title} (Page ${ch.pageStart})`).join('\n')}

================================================================================
EXCERPT / CHAPTER OVERVIEW:
================================================================================

${ebook.chapters.map((ch) => `
[${ch.title}]
${ch.snippet}

${ch.content.join('\n\n')}
`).join('\n--------------------------------------------------------------------------------\n')}

================================================================================
DEVICE COMPATIBILITY INSTRUCTIONS:
- KINDLE: Send this file to your Send-to-Kindle email or drag via USB.
- APPLE BOOKS: Tap Share > Open in Books on your iPhone or iPad.
- ANDROID: Open via Google Play Books or Moon+ Reader.
- WEB: Read anytime in your MNSID Digital Library browser reader without downloading.

NEED HELP?
Contact MNSID Digital Solutions Support: support@mnsid-digital.example.com
Strict No-Refund Policy: All digital purchases are final upon delivery.
================================================================================
`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}_[${format}]_MNSID.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Update download count if in order
    setOrders((prev) =>
      prev.map((ord) => ({
        ...ord,
        items: ord.items.map((item) =>
          item.ebookId === ebook.id ? { ...item, downloadCount: item.downloadCount + 1 } : item
        ),
      }))
    );

    showToast(`Downloaded "${ebook.title}" (${format}) securely!`, 'success');
  };

  // Filtered ebooks
  const filteredEbooks = ebooks.filter((ebook) => {
    // Audience filter
    if (selectedAudience !== 'all' && ebook.audience !== selectedAudience) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'All Categories' && ebook.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ebook.title.toLowerCase().includes(q);
      const matchSubtitle = ebook.subtitle.toLowerCase().includes(q);
      const matchAuthor = ebook.author.name.toLowerCase().includes(q);
      const matchCategory = ebook.category.toLowerCase().includes(q);
      const matchDesc = ebook.shortDescription.toLowerCase().includes(q);
      if (!matchTitle && !matchSubtitle && !matchAuthor && !matchCategory && !matchDesc) {
        return false;
      }
    }
    return true;
  });

  return (
    <StoreContext.Provider
      value={{
        ebooks,
        cart,
        favorites,
        orders,
        libraryEbookIds,
        selectedAudience,
        selectedCategory,
        searchQuery,
        activeCoupon,
        appliedCouponCode,
        couponError,
        isCartOpen,
        isCheckoutOpen,
        isDashboardOpen,
        isSupportOpen,
        dashboardInitialTab,
        previewingEbook,
        readingEbook,
        readingChapterIndex,
        latestOrder,
        viewingEmailOrder,
        toasts,

        setSelectedAudience,
        setSelectedCategory,
        setSearchQuery,
        addToCart,
        removeFromCart,
        clearCart,
        toggleFavorite,
        isFavorite,
        applyCoupon,
        removeCoupon,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        openDashboard,
        closeDashboard,
        openSupport,
        closeSupport,
        openPreview,
        closePreview,
        openReader,
        closeReader,
        setReadingChapterIndex,
        completeCheckout,
        requestRefund,
        downloadEbookFile,
        setViewingEmailOrder,
        showToast,
        removeToast,

        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartCount,
        filteredEbooks,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
