import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Mail, 
  Tablet, 
  DollarSign, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Payments & Pricing',
    question: 'How do student and founder 20% discounts work?',
    answer: 'We provide an exclusive 20% discount for all learners aged 16–24 and students with coupon code "STUDENT20". Professionals and founders aged 25–40 can also take 20% off with coupon code "GROWTH20", bringing the standard $24.99 price down to $19.99.'
  },
  {
    id: 'faq-2',
    category: 'Downloads & Delivery',
    question: 'How quickly will I receive my ebook after purchase?',
    answer: 'Instantly! As soon as payment completes (typically 2-3 seconds), your files are available for direct download on the confirmation screen. You also receive an automated confirmation email with tokenized lifetime download links and a VAT receipt.'
  },
  {
    id: 'faq-3',
    category: 'Device Compatibility',
    question: 'Can I read these ebooks on Kindle, iPad, or Android?',
    answer: 'Yes! Every purchase includes all 3 major formats: PDF (for laptops and printing), EPUB (for Apple Books, Kobo, and Android readers), and MOBI (for Amazon Kindle). You can also use our zero-footprint In-Browser Web Reader on any browser.'
  },
  {
    id: 'faq-4',
    category: 'Refunds & Policy',
    question: 'What is your refund policy for digital ebooks?',
    answer: 'Due to the immediate digital delivery and DRM-free nature of digital files, all sales are final and strictly non-refundable once purchased. To ensure complete confidence before buying, every title includes an extensive free "Look Inside" sample chapter preview and table of contents so you can inspect the material thoroughly before paying.'
  },
  {
    id: 'faq-5',
    category: 'Content Quality & Preview',
    question: 'Can I read a sample before paying?',
    answer: 'Absolutely. Every ebook in our catalog features a "Look Inside" button that launches our interactive reader modal. You can inspect the table of contents and read the complete first chapter with adjustable font sizes before spending a single dollar.'
  },
  {
    id: 'faq-6',
    category: 'Offline & Storage',
    question: 'Do I need an internet connection to read, or will it take up storage space?',
    answer: 'Once downloaded, the files are 100% yours and work completely offline without internet. If you have limited storage on your phone, you can also read anytime via our cloud Web Reader in your browser without saving heavy files.'
  },
  {
    id: 'faq-7',
    category: 'Copyright & Security',
    question: 'Are these ebooks legally licensed and DRM-free?',
    answer: 'Yes. All titles published under MNSID Digital Solutions are legally licensed and DRM-free for personal use. You will never encounter frustrating software locks preventing you from reading your purchased book across your own personal devices.'
  },
  {
    id: 'faq-8',
    category: 'Payments & Privacy',
    question: 'What payment methods do you accept, and is my data safe?',
    answer: 'We accept Credit/Debit Cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and PayPal. All transactions are protected by 256-bit AES encryption with PCI-DSS Level 1 compliance. We never store raw credit card details or sell your personal data.'
  }
];

export const SupportModal: React.FC = () => {
  const { isSupportOpen, closeSupport, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-2');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  if (!isSupportOpen) return null;

  const filteredFaqs = FAQS_LIST.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setTicketSent(true);
    showToast('Support ticket dispatched! Priority response within 2 hours.', 'success');
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setTicketSent(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Customer Help Desk &amp; FAQs</h2>
              <p className="text-xs text-slate-400">
                Answers to payment questions, device transfers, formats, and download assistance
              </p>
            </div>
          </div>

          <button
            onClick={closeSupport}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* FAQ Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search help articles (e.g., Kindle, refund, payment, download)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Frequently Answered Questions ({filteredFaqs.length})
            </h3>

            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left bg-white hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
                        {faq.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{faq.question}</h4>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Support Ticket Form */}
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">Still Need Assistance? Ask Our Team</h4>
              </div>

              {ticketSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Thank you! Your ticket has been received. Our human support engineer will reply within 2 hours.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSendTicket} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Subject / Issue Type
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Need assistance transferring EPUB to Kobo reader"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Details / Message
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your question or order number..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Support Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
