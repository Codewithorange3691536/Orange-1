export type AudienceType = 'students' | 'professionals' | 'all';

export type EbookCategory = 
  | 'UI/UX Design'
  | 'Web Dev & AI'
  | 'Business & Startups'
  | 'Career & Productivity'
  | 'Marketing & Sales'
  | 'Design & Creative';

export type BookFormat = 'PDF' | 'EPUB' | 'MOBI' | 'Web Reader';

export interface Chapter {
  id: number;
  title: string;
  pageStart: number;
  snippet: string;
  isPreviewAvailable: boolean;
  content: string[];
}

export interface Review {
  id: string;
  userName: string;
  userRole: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Ebook {
  id: string;
  title: string;
  subtitle: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    credentials: string;
  };
  category: EbookCategory;
  audience: AudienceType;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  colorTheme: string;
  badge?: 'Bestseller' | 'Student Pick' | 'New 2026' | 'Founder Choice' | 'Trending';
  pages: number;
  language: string;
  fileSize: string;
  publicationYear: number;
  isbn: string;
  formats: BookFormat[];
  shortDescription: string;
  fullDescription: string;
  keyTakeaways: string[];
  prerequisites: string;
  deviceCompatibility: string[];
  chapters: Chapter[];
  sampleExcerpt: {
    title: string;
    content: string[];
  };
  reviews: Review[];
  bonusItems?: string[];
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Beginner to Pro';
  readingTime?: string;
  audioSampleAvailable?: boolean;
}

export interface CartItem {
  ebook: Ebook;
  selectedFormat?: BookFormat;
}

export interface OrderItem {
  ebookId: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  formats: BookFormat[];
  fileSize: string;
  licenseKey: string;
  downloadCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'refunded';
  deliveryStatus: 'delivered';
  downloadToken: string;
  tokenExpiresAt: string;
  receiptNumber: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  audience?: AudienceType;
  minAmount?: number;
}
