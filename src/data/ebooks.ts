import { Ebook, Coupon } from '../types';

export const EBOOKS_DATA: Ebook[] = [
  {
    id: 'ebook-ai-students',
    title: 'Modern AI & Prompt Engineering for Students',
    subtitle: 'Accelerate Academic Research, Build Side Hustles, and Master Future Skills',
    author: {
      name: 'Dr. Ryan Alistair',
      role: 'AI Researcher & Computer Science Lecturer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      credentials: 'Ph.D. in Machine Learning, 10+ years teaching at top universities',
    },
    category: 'Web Dev & AI',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviewsCount: 312,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-blue-600 to-indigo-800',
    badge: 'Student Pick',
    pages: 218,
    language: 'English (US & UK)',
    fileSize: '8.4 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-101-2',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The definitive student guide to using modern generative AI ethically and effectively for university coursework, coding, and freelance income.',
    fullDescription: 'Designed specifically for ambitious students aged 16–24, this practical ebook demystifies generative models. Learn how to construct multi-stage chain-of-thought prompts for deep research, summarize dense scientific papers in seconds, debug programming assignments without cheating, and generate $500–$2,000/month providing AI-assisted services to local businesses.',
    keyTakeaways: [
      'Master prompt structures: zero-shot, few-shot, and role-based personas',
      'Conduct literature reviews and citation checks in one-tenth of the time',
      'Build your own autonomous study assistant with custom system prompts',
      'Turn technical skills into profitable freelance services during college',
      'Understand ethical AI boundaries and academic integrity policies'
    ],
    prerequisites: 'No prior coding experience required. Suitable for high school & university students.',
    deviceCompatibility: ['Kindle (all models)', 'iPad & iPhone (Apple Books)', 'Android (Google Play Books)', 'Mac & Windows (PDF/EPUB)'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Modern AI Revolution for Learners',
        pageStart: 1,
        snippet: 'Why memorization is dead and prompt literacy is the single greatest superpower of our decade.',
        isPreviewAvailable: true,
        content: [
          'The traditional educational paradigm was built on information scarcity. If you wanted to understand quantum mechanics or historical economic cycles in 1995, you had to physically visit a library, search index cards, and parse dense textbooks.',
          'Today, we live in information hyper-abundance. The bottleneck is no longer access to knowledge; it is synthesis, verification, and structured inquiry.',
          'A student armed with effective prompt engineering is not just faster—they are capable of iterative Socratic dialogue with the sum total of human scientific literature.',
          'In this chapter, we outline the foundational shift from passive search engines to active reasoning partners. You will learn the Three Rules of Inquiry: Clarity of Intent, Contextual Priming, and Verification Loop.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: The S.T.A.R. Framework for Flawless Prompts',
        pageStart: 28,
        snippet: 'How to structure System, Task, Audience, and Rules to eliminate hallucinations.',
        isPreviewAvailable: true,
        content: [
          'Most students get poor or generic AI outputs because their prompts are one sentence long: "Explain photosynthesis" or "Write an intro for my paper".',
          'To extract world-class precision from modern language models, adopt the S.T.A.R. architecture:',
          '1. [S] System Role: Define the exact expertise, tone, and cognitive depth required (e.g. "You are an expert computational biologist reviewing for Nature").',
          '2. [T] Task & Objective: Be brutally explicit about the exact deliverable, length, and format required.',
          '3. [A] Audience Context: Clarify who will read or grade the deliverable.',
          '4. [R] Rules & Constraints: Strict guardrails—"Do not invent citations. Highlight uncertain assertions with brackets. Use active voice."'
        ]
      },
      {
        id: 3,
        title: 'Chapter 3: Accelerated Exam Preparation & Active Recall',
        pageStart: 64,
        snippet: 'Creating adaptive flashcards and simulating tough oral examinations.',
        isPreviewAvailable: false,
        content: [
          'Transform your lecture slides into spaced-repetition flashcard sets formatted directly for Anki.',
          'Simulate stressful exam questioning with strict timed scenarios.'
        ]
      },
      {
        id: 4,
        title: 'Chapter 4: Coding & Debugging Without Brain Rot',
        pageStart: 110,
        snippet: 'Using code assistants to understand architecture rather than copying blindly.',
        isPreviewAvailable: false,
        content: []
      },
      {
        id: 5,
        title: 'Chapter 5: Earning While Learning - Profitable Freelance Blueprints',
        pageStart: 165,
        snippet: '5 vetted freelance workflows providing digital solutions to local companies.',
        isPreviewAvailable: false,
        content: []
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The Socratic Dialogue Technique',
      content: [
        'Before you write a single line of your research thesis, engage your reasoning engine with this prompt:',
        '"Act as an adversarial thesis committee examiner. Here is my thesis outline: [Insert Outline]. Probe this logic for the top 5 weakest assumptions, unproven causal links, and alternative explanations. Be rigorous and do not spare my feelings."',
        'By testing your ideas against simulated academic resistance, your actual paper becomes virtually bulletproof.'
      ]
    },
    reviews: [
      {
        id: 'rev-1',
        userName: 'Alex Chen',
        userRole: '2nd Year Computer Science Student',
        rating: 5,
        date: 'Oct 3, 2026',
        title: 'Cut my research paper prep time in half!',
        comment: 'I was skeptical about another "AI prompts" book, but Dr. Alistair focuses on real cognitive techniques. The S.T.A.R. framework alone is worth 10x the price. Kindle download worked instantly.',
        verifiedPurchase: true,
        helpfulCount: 42
      },
      {
        id: 'rev-2',
        userName: 'Elena Rostova',
        userRole: 'Business Undergraduate',
        rating: 5,
        date: 'Sep 28, 2026',
        title: 'Clean formatting and super practical for exams',
        comment: 'The EPUB looks gorgeous on my Kobo e-reader and the in-browser reader let me start studying immediately after buying while waiting for my coffee.',
        verifiedPurchase: true,
        helpfulCount: 19
      }
    ]
  },
  {
    id: 'ebook-fullstack-fasttrack',
    title: 'Full-Stack Web Dev FastTrack (2026 Edition)',
    subtitle: 'From Absolute Beginner to Deploying Production React & TypeScript Apps in 90 Days',
    author: {
      name: 'Marcus Vance',
      role: 'Staff Engineer & Bootcamp Mentor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      credentials: 'Ex-Stripe Architect, author of 3 tech bestsellers with 40k+ readers',
    },
    category: 'Web Dev & AI',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.95,
    reviewsCount: 489,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-cyan-600 to-blue-900',
    badge: 'Bestseller',
    pages: 340,
    language: 'English',
    fileSize: '14.2 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-102-9',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'Zero fluff, project-based engineering guide covering modern React 19, TypeScript, Tailwind CSS, REST & GraphQL APIs, and cloud deployments.',
    fullDescription: 'Tired of 60-hour video tutorials where you just copy what instructors type without understanding why? This hands-on handbook teaches software architecture, debugging intuition, and full-stack integration from the ground up. Build 4 portfolio-grade web applications that recruiters actually respect.',
    keyTakeaways: [
      'Master TypeScript types, generics, and strict patterns without headache',
      'Build responsive, accessible interfaces with Tailwind CSS and React 19 hooks',
      'Design clean API contracts and state management pipelines',
      'Implement real authentication, secure cookies, and database schemas',
      'Deploy full-stack projects on modern edge clouds with automated CI/CD'
    ],
    prerequisites: 'Basic familiarity with computer usage. Zero prior programming required.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Windows Surface', 'Android Tablets'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Modern Web Anatomy Explained',
        pageStart: 1,
        snippet: 'How browsers render, how servers listen, and how modern bundlers compile code.',
        isPreviewAvailable: true,
        content: [
          'Before touching syntax, you need a mental model of what happens when a user types a URL into their browser address bar.',
          '1. DNS Resolution: Translating human-friendly names into IP routing targets.',
          '2. TCP/TLS Handshake: Securing the pipe with cryptographic certificates.',
          '3. HTTP Request & Response Cycle: Streaming initial HTML, parsing CSSOM, building the DOM tree.',
          '4. JavaScript Execution: Hydration, microtask queues, and reactive UI reconciliation.',
          'When you understand this fundamental pipeline, debugging complex bugs becomes second nature.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: TypeScript Without the Headaches',
        pageStart: 42,
        snippet: 'Interfaces vs types, generics demystified, and writing clean type guards.',
        isPreviewAvailable: true,
        content: [
          'TypeScript is not a separate programming language; it is a compilation-time contract that ensures your runtime code will not crash unexpectedly.',
          'Key rule: Let TypeScript infer what is obvious, and explicitly type what constitutes your domain boundaries.',
          'In this chapter, we build our first domain entities: User, Session, and Product, proving how types prevent 80% of junior developer errors before code ever hits git.'
        ]
      },
      {
        id: 3,
        title: 'Chapter 3: Component Architecture & State Management',
        pageStart: 95,
        snippet: 'Designing composable components that scale to thousands of lines.',
        isPreviewAvailable: false,
        content: []
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 2: The Principle of Single Source of Truth',
      content: [
        'Whenever you duplicate state across two components or two variables, you invite synchronization bugs.',
        'Always compute derived state on the fly. If you have an array of cart items, do NOT store a separate "totalPrice" state variable. Derive it directly: const total = items.reduce((sum, item) => sum + item.price, 0);'
      ]
    },
    reviews: [
      {
        id: 'rev-3',
        userName: 'David Miller',
        userRole: 'Self-taught Developer',
        rating: 5,
        date: 'Oct 8, 2026',
        title: 'Land my first junior role thanks to this book!',
        comment: 'The portfolio projects taught in this book stood out in my interviews because they had real architecture and test patterns. The PDF has crisp code syntax highlighting.',
        verifiedPurchase: true,
        helpfulCount: 56
      }
    ]
  },
  {
    id: 'ebook-freelance-college',
    title: 'The Digital Freelancer Blueprint',
    subtitle: 'How to Land Your First $1,000+ Clients While Still in College or Working Full-Time',
    author: {
      name: 'Samantha Grey',
      role: 'Top-Rated Freelancer & Agency Owner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      credentials: 'Generated $350k+ freelancing during her undergraduate studies',
    },
    category: 'Business & Startups',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.88,
    reviewsCount: 215,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-amber-600 to-orange-800',
    badge: 'Trending',
    pages: 185,
    language: 'English',
    fileSize: '6.9 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-103-6',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'Step-by-step cold outreach scripts, portfolio templates, and pricing psychology for young beginners looking to monetize copywriting, web design, or digital marketing.',
    fullDescription: 'Stop trading your hours for minimum wage at campus retail jobs. This practical playbook reveals the exact positioning strategy, proposal templates, and contract clauses required to charge $500–$2,500 per project for digital services. Includes word-for-word email templates and handling client objections.',
    keyTakeaways: [
      'Position yourself as a specialized solution provider rather than an amateur generalist',
      'The 3-paragraph cold outreach email that achieves a 34% response rate',
      'How to price based on client value instead of punishing yourself with hourly rates',
      'Legally binding client contract templates customized for freelance projects',
      'Balancing client deadlines with university exam schedules without burning out'
    ],
    prerequisites: 'Basic digital communication skills. Any beginner skill (writing, design, tech, video editing).',
    deviceCompatibility: ['Kindle', 'iOS', 'Android', 'E-readers'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Escaping the Minimum Wage Trap',
        pageStart: 1,
        snippet: 'Why businesses will happily pay a 20-year-old student $1,000 for 10 hours of work.',
        isPreviewAvailable: true,
        content: [
          'Clients do not care about your age, your degree, or the prestige of your university.',
          'They care about one thing: Can you solve a specific business problem that generates more revenue or saves them critical operational time?',
          'When you reframe your offering around business outcomes instead of student labor, you instantly step out of the crowded gig economy and into high-ticket freelance consulting.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: Picking Your High-Leverage Beachhead',
        pageStart: 25,
        snippet: 'How to niche down so you face zero competition.',
        isPreviewAvailable: true,
        content: [
          'If you say "I am a web designer", you compete with 2 million freelancers globally.',
          'If you say "I design high-converting booking funnels for local dental practices", you are suddenly one of five specialists in your entire region.',
          'We break down 12 high-paying niches currently desperate for young digital talent.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 3: The 3-Paragraph Outreach Script',
      content: [
        'Subject: Quick observation regarding [Company Name]\'s mobile checkout flow\n\nHi [First Name],\n\nI noticed on your checkout page that mobile visitors experience a 4-second delay before the cart button activates. I recorded a 90-second Loom showing exactly how fixing this can lift conversion rates by 15-20%.\n\nWould it be helpful if I sent that video over? No charge or strings attached.\n\nBest,\n[Your Name]'
      ]
    },
    reviews: [
      {
        id: 'rev-4',
        userName: 'Jordan Lee',
        userRole: 'College Sophomore',
        rating: 5,
        date: 'Oct 1, 2026',
        title: 'Closed my first $800 retainer client!',
        comment: 'Used the outreach template from Chapter 3 on LinkedIn. Had 3 discovery calls within a week and signed a local fitness studio. Ebook paid for itself 100 times over.',
        verifiedPurchase: true,
        helpfulCount: 38
      }
    ]
  },
  {
    id: 'ebook-high-converting-store',
    title: 'The High-Converting Digital Store',
    subtitle: 'Proven Conversion Rate Optimization (CRO) Frameworks for Small E-Commerce Businesses',
    author: {
      name: 'Naveen Siddiqui',
      role: 'Principal CRO Consultant & E-Commerce Founder',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      credentials: 'Optimized $40M+ in digital product sales; Founder of MNSID Digital Solutions',
    },
    category: 'Business & Startups',
    audience: 'professionals',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.96,
    reviewsCount: 520,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-emerald-600 to-teal-900',
    badge: 'Founder Choice',
    pages: 295,
    language: 'English',
    fileSize: '11.8 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-201-9',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'Master the science of turn visitors into paying customers. Tackle payment friction, checkout drop-offs, pricing psychology, and social proof.',
    fullDescription: 'Written specifically for small business owners and digital product creators looking to double their conversion rates without doubling ad spend. Covers the psychological drivers of trust, eliminating cart abandonment, designing friction-free checkout funnels, instant digital delivery systems, and automating repeat purchases.',
    keyTakeaways: [
      'Deconstruct the 7 deadly conversion leaks killing digital product stores',
      'Psychological pricing frameworks: anchoring, bundle framing, and decoy tiers',
      'Eliminate payment friction: multiple gateways, 1-click buy, and instant trust seals',
      'Design product preview experiences that compel purchase before checkout',
      'Automated post-purchase onboarding emails that reduce refund rates to under 1%'
    ],
    prerequisites: 'For existing or aspiring digital store owners, entrepreneurs, and digital marketers.',
    deviceCompatibility: ['All E-readers', 'iPad & Mac', 'Kindle', 'Android & Windows'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Friction-Trust Balance Equation',
        pageStart: 1,
        snippet: 'Why shoppers hesitate and how micro-commitments dismantle buyer anxiety.',
        isPreviewAvailable: true,
        content: [
          'Every online transaction is an emotional calculation: Perceived Value minus Perceived Risk.',
          'When selling digital goods (where customers cannot physically touch the product), Perceived Risk is naturally elevated. Buyers wonder: "Is this website legit? Will the download work? Can I read this on my iPad? What if the content is generic junk?"',
          'To achieve exceptional conversion rates (3% to 6%+), you must systematically eradicate every single risk objection on the page before the customer even thinks of asking it.',
          'This chapter provides the 12 Trust Anchors that instantly signal enterprise legitimacy.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: The Perfect Digital Product Page Anatomy',
        pageStart: 38,
        snippet: 'Deconstructing hero banners, sample chapters, format compatibility badges, and transparent guarantees.',
        isPreviewAvailable: true,
        content: [
          'A digital product page must be treated as an interactive showroom.',
          'Never hide what is inside the file behind vague promotional blurbs. Provide an interactive "Look Inside" sample, detailed table of contents with page counts, format checkmarks (PDF, EPUB, MOBI), and clear author credentials.',
          'When customers can inspect real sample pages directly in their browser, conversion rates increase by up to 43%.'
        ]
      },
      {
        id: 3,
        title: 'Chapter 3: Checkout Optimization & Payment Assurance',
        pageStart: 82,
        snippet: 'Preventing checkout declines and offering multiple preferred payment rails.',
        isPreviewAvailable: false,
        content: []
      },
      {
        id: 4,
        title: 'Chapter 4: Instant Automated Delivery & Post-Purchase Magic',
        pageStart: 140,
        snippet: 'How automated transactional emails build lifetime customer loyalty.',
        isPreviewAvailable: false,
        content: []
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 2: The High-Conversion Preview Architecture',
      content: [
        'A buyer hesitates when they cannot inspect the digital goods before entering payment information.',
        'An interactive, frictionless in-browser preview of sample chapters builds instant credibility and trust.',
        'In testing across 250,000 transactions, offering free sample chapters increased net sales conversion by 34% with zero friction.'
      ]
    },
    reviews: [
      {
        id: 'rev-5',
        userName: 'Rachel Adams',
        userRole: 'E-commerce Brand Owner',
        rating: 5,
        date: 'Oct 6, 2026',
        title: 'Implemented Chapter 2 checklist: our store conversion grew from 1.4% to 3.2%!',
        comment: 'The advice on automated delivery and preview transparency changed our entire business model. Must-read for any digital merchant.',
        verifiedPurchase: true,
        helpfulCount: 64
      }
    ]
  },
  {
    id: 'ebook-saas-growth-playbook',
    title: 'SaaS Growth & Scale Playbook',
    subtitle: 'From Pre-Product-Market Fit to $100K Monthly Recurring Revenue (MRR)',
    author: {
      name: 'Julian Sterling',
      role: 'Growth Advisor & Serial Tech Founder',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      credentials: 'Built and scaled 2 B2B software companies to 8-figure private acquisitions',
    },
    category: 'Business & Startups',
    audience: 'professionals',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.93,
    reviewsCount: 388,
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-violet-700 to-purple-950',
    badge: 'Bestseller',
    pages: 312,
    language: 'English',
    fileSize: '13.5 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-202-6',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The comprehensive operating system for founders, product managers, and growth leads to scale ARR, reduce churn, and drive organic product virality.',
    fullDescription: 'Packed with real financial models, unit economics spreadsheets, customer interview scripts, and activation funnel metrics. Learn how modern software companies acquire enterprise accounts without bloated sales teams and how to design product-led loops that drive sustainable compounding growth.',
    keyTakeaways: [
      'Identify true Product-Market Fit using the 40% "Very Disappointed" test',
      'Optimize customer acquisition cost (CAC) to lifetime value (LTV) ratios above 3.5x',
      'Build onboarding flows that lead users to their "Aha!" moment under 90 seconds',
      'Implement enterprise pricing tiers with value metrics that expand automatically',
      'Prevent involuntary churn and salvage at-risk corporate accounts'
    ],
    prerequisites: 'Founders, product leaders, developers, and agency executives.',
    deviceCompatibility: ['Kindle', 'iPad', 'Desktop PDF Reader', 'Mobile EPUB'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Anatomy of True Product-Market Fit',
        pageStart: 1,
        snippet: 'Why vanity metrics fool founders and the leading indicators of retention.',
        isPreviewAvailable: true,
        content: [
          'Growth before retention is pouring expensive water into a leaky bucket.',
          'If your cohort retention curves do not flatten out parallel to the x-axis, you do not have Product-Market Fit. Spending money on ads or inbound marketing at this stage is financial malpractice.',
          'In this chapter, we establish the quantitative metrics that prove customer addiction before you invest heavily in customer acquisition.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: Designing the Product-Led Growth Engine',
        pageStart: 45,
        snippet: 'Virality loops, self-serve onboarding, and in-app activation checkpoints.',
        isPreviewAvailable: true,
        content: [
          'Product-led companies do not rely on aggressive salespeople calling prospects cold.',
          'The product itself is the storefront, salesperson, onboarding specialist, and renewal manager.',
          'We study how Slack, Figma, and Notion embed natural collaboration hooks into everyday workflows.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 2: The 90-Second Activation Rule',
      content: [
        'If a user signs up for your tool and cannot see an initial tangible result or preview within 90 seconds, drop-off rates surge past 65%.',
        'Strip away upfront email confirmations, payment prompts, and multi-step onboarding surveys. Let them create value immediately, then ask for credentials when they want to save or share.'
      ]
    },
    reviews: [
      {
        id: 'rev-6',
        userName: 'Vikram Patel',
        userRole: 'SaaS Founder',
        rating: 5,
        date: 'Sep 30, 2026',
        title: 'The bible for subscription software companies',
        comment: 'Every page is dense with actionable insights, no fluff. Downloaded both PDF for notes and EPUB for my nighttime Kindle reading.',
        verifiedPurchase: true,
        helpfulCount: 71
      }
    ]
  },
  {
    id: 'ebook-monetize-youtube-framework',
    title: 'How to Monetize Your YouTube Channel With Framework',
    subtitle: 'The 7-Step Architecture for High CPMs, Brand Sponsorships, and Automated Digital Funnels',
    author: {
      name: 'Marcus Vance',
      role: 'Media Strategist & 1.4M Subscriber Creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      credentials: 'Generated $2.8M+ in YouTube monetization, AdSense, and creator sponsorships',
    },
    category: 'Marketing & Sales',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.96,
    reviewsCount: 485,
    coverImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-red-600 via-rose-700 to-slate-950',
    badge: 'Bestseller',
    pages: 265,
    language: 'English',
    fileSize: '13.4 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-401-3',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The proven framework to turn views into serious income. Master high-CPM niches, pitch 4-figure brand sponsors, and convert subscribers into buyers.',
    fullDescription: 'Stop waiting for microscopic AdSense pennies. This comprehensive framework reveals the exact system top creators use to make $5k–$25k/month even with modest sub counts. Learn high-ticket video positioning, landing corporate sponsors with cold outreach, and building digital product funnels directly in your video descriptions.',
    keyTakeaways: [
      'The High-CPM Niche Matrix: Why finance, tech & education pay 10x gaming views',
      'The Brand Sponsorship Pitch Formula: Securing $1,500–$5,000 deals with under 10k subs',
      'Algorithmic Packaging: Hook retention curves, thumbnail psychology, and click velocity',
      'Affiliate & Digital Product Funnels: Converting 1 out of 50 viewers into recurring buyers',
      'Creator Business Systems: Taxes, team delegation, and multi-platform repurposing'
    ],
    prerequisites: 'Creators, students, beginners, and video editors of any experience level.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Android Tablets', 'Windows Surface'],
    bonusItems: [
      '20+ Brand Sponsorship Outreach Scripts (.docx)',
      'YouTube Channel Revenue Modeling Sheet',
      'High-CTR Thumbnail & Title Blueprint'
    ],
    level: 'Beginner to Pro',
    readingTime: '3.6 hrs reading time',
    audioSampleAvailable: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Deconstructing the YouTube Monetization Myth',
        pageStart: 1,
        snippet: 'Why subscriber count is vanity and revenue per mille (RPM) is sanity.',
        isPreviewAvailable: true,
        content: [
          'A creator with 500,000 subscribers making prank videos can struggle to pay rent, while a creator with 15,000 subscribers breaking down cloud software earns $18,000 every single month.',
          'YouTube is not a video host; it is the second-largest search engine on earth and the highest-trust consumer conversion funnel in existence.',
          'In this chapter, we dissect the 4 Income Pillars: High-CPM AdSense, Brand Integration Retainers, High-Yield Affiliate Links, and Direct Digital Asset Sales.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: The S.P.O.N.S.O.R. Cold Outreach Blueprint',
        pageStart: 42,
        snippet: 'Word-for-word email proposals that get enterprise marketing managers to reply with budget.',
        isPreviewAvailable: true,
        content: [
          'Brands do not buy your subscriber count; they buy access to a specific buyer persona that solves their customer acquisition problem.',
          'When you pitch a software brand with quantitative audience demographics and dedicated call-to-action tracking, your closing rate surges past 40%.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 2: The 3-Sentence Brand Pitch',
      content: [
        'Subject: Partnership idea for [Brand Name] + [Your Channel Name] audience\n\nHi [Name],\n\nMy audience of 8,500 active learners consists of 72% front-end developers searching for tools like [Brand Name]. On my last integration with a developer tool, we generated 340 qualified trial signups in 72 hours.\n\nWould you be open to seeing a 60-second concept for next Tuesday\'s release?'
      ]
    },
    reviews: [
      {
        id: 'rev-yt-1',
        userName: 'Devin Cole',
        userRole: 'Tech Creator (12k subs)',
        rating: 5,
        date: 'Oct 11, 2026',
        title: 'Signed my first $2,400 monthly sponsor!',
        comment: 'Used the outreach template from Chapter 2. Closed a developer tools company within 5 days of sending proposals. This ebook paid for itself 200 times over.',
        verifiedPurchase: true,
        helpfulCount: 78
      }
    ]
  },
  {
    id: 'ebook-create-ebook-framework',
    title: 'How to Create an Ebook With Framework',
    subtitle: 'From Profitable Topic Ideation & Fast Outlining to Design, Publishing & 6-Figure Sales',
    author: {
      name: 'Naveen Siddiqui',
      role: 'Digital Publisher & Founder of MNSID Digital Solutions',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      credentials: 'Generated $1.4M+ in digital publishing across 12 best-selling ebook releases',
    },
    category: 'Business & Startups',
    audience: 'professionals',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.98,
    reviewsCount: 520,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-amber-600 via-orange-700 to-slate-900',
    badge: 'Founder Choice',
    pages: 250,
    language: 'English',
    fileSize: '11.8 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-402-0',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The step-by-step digital publishing operating system. Write, format, design, price, and sell high-margin digital ebooks without writing blocks.',
    fullDescription: 'Why spend 6 months struggling with blank pages? This battle-tested framework breaks down how to validate market demand before typing a single sentence, construct a compelling table of contents using modular cognitive blocks, design high-converting covers in Figma, compile pristine PDF/EPUB/MOBI files, and launch to an eager audience.',
    keyTakeaways: [
      'The 48-Hour Validation Protocol: Pre-selling your ebook before writing a word',
      'The Modular Outline Framework: Drafting a complete 150-page ebook in 14 days',
      'Cover Design Psychology: Creating professional 3D mockups that compel purchases',
      'Multi-Format Compilation: Exporting clean PDF, EPUB, and Kindle MOBI files with zero formatting bugs',
      'Automated Funnels & Pricing: Maximizing Average Order Value with bundle tiers'
    ],
    prerequisites: 'Beginners, experts, consultants, students, and aspiring digital authors.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Android Tablets', 'Windows'],
    bonusItems: [
      'Complete Ebook Launch Blueprint Checklist',
      '10 High-Converting Figma Book Cover Templates (.fig)',
      'Legal Copyright & DRM-Free Licensing Notice Starter Pack'
    ],
    level: 'Beginner to Pro',
    readingTime: '3.4 hrs reading time',
    audioSampleAvailable: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Anatomy of a High-Converting Digital Ebook',
        pageStart: 1,
        snippet: 'Why traditional book publishing is dead and digital niche handbooks dominate.',
        isPreviewAvailable: true,
        content: [
          'People do not buy ebooks to admire 400 pages of rambling prose. In our fast-paced world, buyers want a specific, actionable solution to an acute problem.',
          'A 120-page actionable guide priced at $19.99 regularly outsells a 500-page academic tome priced at $9.99 because readers crave distilled clarity, not filler.',
          'In this chapter, we map out the 5 Core Pillars: Problem Pinpointing, Framework Formulation, Visual Hierarchy, Formatting Hygiene, and Automated Delivery.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: The 14-Day Modular Sprint Writing Method',
        pageStart: 35,
        snippet: 'How to write 1,500 words per day using cognitive prompt chaining and active frameworks.',
        isPreviewAvailable: true,
        content: [
          'Writer\'s block only occurs when you attempt to outline and draft simultaneously.',
          'By separating the architectural blueprint phase from the prose synthesis phase, writing becomes as predictable as assembling modular Lego bricks.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The High-Margin Pricing Sweetspot',
      content: [
        'Never price your digital expertise at $0.99 or $2.99 unless you are competing in disposable fiction. Non-fiction digital handbooks that solve career, design, coding, or business bottlenecks convert highest between $9.99 and $29.99 because perceived value matches price authority.'
      ]
    },
    reviews: [
      {
        id: 'rev-eb-1',
        userName: 'Hannah Lindqvist',
        userRole: 'First-Time Author & Designer',
        rating: 5,
        date: 'Oct 12, 2026',
        title: 'Published my first ebook in 10 days and made $3,400!',
        comment: 'Naveen\'s framework removed all the friction. The included Figma book cover templates and outline structure gave me the exact confidence I needed. Incredible value.',
        verifiedPurchase: true,
        helpfulCount: 92
      }
    ]
  },
  {
    id: 'ebook-monetize-social-media-framework',
    title: 'How to Monetize Your Social Media Account With Framework',
    subtitle: 'Transform Followers into High-Paying Clients: Content Flywheels, DMs to Cash, and Offer Stacking',
    author: {
      name: 'Samantha Grey',
      role: 'Creator Economy Advisor & 7-Figure Agency Founder',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      credentials: 'Helped 150+ creators and brands monetize Instagram, X (Twitter), LinkedIn & TikTok',
    },
    category: 'Marketing & Sales',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.95,
    reviewsCount: 390,
    coverImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-fuchsia-600 via-pink-700 to-indigo-950',
    badge: 'Trending',
    pages: 240,
    language: 'English',
    fileSize: '12.1 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-403-7',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The comprehensive framework to monetize any social following. Master conversion hooks, high-ticket DM closing scripts, and evergreen affiliate flywheels.',
    fullDescription: 'Stop collecting useless vanity likes that never pay your bills. This battle-tested operating system shows students, freelancers, and entrepreneurs how to convert casual social media scrollers into paying customers. Packed with organic lead generation flywheels, direct messaging sales scripts, and setting up automated digital storefronts with zero ad spend.',
    keyTakeaways: [
      'The 3-Tier Content Engine: Authority content, relatable hooks, and commercial CTAs',
      'The Conversational DM Script: Closing $500–$2,000 clients without aggressive pitching',
      'The Evergreen Affiliate Engine: Generating $1,000+/month with curated software tools',
      'Micro-Offer Stacking: Launching low-ticket digital guides that fund paid customer acquisition',
      'Cross-Platform Optimization: Repurposing one core idea across X, LinkedIn, and Instagram'
    ],
    prerequisites: 'Anyone with an active Instagram, X, LinkedIn, or TikTok account (even under 1,000 followers).',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Android Tablets', 'Windows Surface'],
    bonusItems: [
      '50 Viral Hook Templates for Instagram & X',
      'DM-to-Client Conversational Sales Matrix (.pdf)',
      'Brand Sponsorship Rate Card Calculator'
    ],
    level: 'Beginner to Pro',
    readingTime: '3.2 hrs reading time',
    audioSampleAvailable: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Great Follower Fallacy',
        pageStart: 1,
        snippet: 'Why 2,000 engaged target buyers beat 100,000 random viral scrollers every time.',
        isPreviewAvailable: true,
        content: [
          'You do not need a million followers to build a high-income business online. In fact, viral entertainment content often attracts an audience that never intends to spend a single dollar.',
          'Monetization is about trust density, not audience breadth.',
          'When 500 people view you as the definitive authority on a specific topic—whether that is React coding, design systems, student study habits, or local consulting—your conversion rate skyrockets.',
          'In this chapter, we build your High-Trust Positioning Statement.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: The Conversational DM Closing Method',
        pageStart: 38,
        snippet: 'How to transition friendly comment discussions into client payments effortlessly.',
        isPreviewAvailable: true,
        content: [
          'Never send spammy cold copy-paste pitches into people\'s inboxes. That destroys credibility immediately.',
          'We use the Diagnostic Question Method: asking permission, identifying their bottleneck, offering a quick loom or free checklist, and inviting them to an effortless next step.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 2: The Soft-Touch Transition Script',
      content: [
        '"Hey [Name], saw your comment on my post about [Topic]! Are you currently struggling with [Specific Bottleneck] or just exploring ideas? Either way, happy to share our free checklist."'
      ]
    },
    reviews: [
      {
        id: 'rev-sm-1',
        userName: 'Lucas Wright',
        userRole: 'Freelance Copywriter & Creator',
        rating: 5,
        date: 'Oct 9, 2026',
        title: 'Made $1,800 in my first week with under 800 followers',
        comment: 'The DM scripts in Chapter 2 are brilliant. No sleazy sales tactics, just genuine help that turned 3 followers into paying consulting clients. Unbelievably practical.',
        verifiedPurchase: true,
        helpfulCount: 65
      }
    ]
  },
  {
    id: 'ebook-superlearner-deepwork',
    title: 'The SuperLearner Handbook',
    subtitle: 'Deep Work, Active Recall, and Accelerated Skill Acquisition for Young Achievers',
    author: {
      name: 'Dr. Leonard Scott',
      role: 'Cognitive Neuroscientist & Educator',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      credentials: 'Stanford Cognitive Science Fellow; 15 years research in neuroplasticity',
    },
    category: 'Career & Productivity',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.89,
    reviewsCount: 410,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-purple-600 to-indigo-900',
    badge: 'Student Pick',
    pages: 172,
    language: 'English',
    fileSize: '5.2 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-104-3',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'Brain-based study habits, beating smartphone addiction, Feynman technique, and crushing academic exams with minimal stress.',
    fullDescription: 'Stop rereading lecture notes and highlighting sentences endlessly—cognitive research proves these are the least effective study methods in existence. This short, actionable handbook gives you the biological protocols for neuroplasticity, memory consolidation during sleep, and entering flow states on command.',
    keyTakeaways: [
      'The Feynman Technique: How to explain difficult topics in 5-year-old terms to achieve master-level clarity',
      'Spaced repetition mathematics: Why reviewing for 15 minutes across 4 days beats a 6-hour cram session',
      'Dopamine regulation: Eliminating phone distractions without willpower fatigue',
      'Exam performance psychology: Eliminating mental blanks and anxiety during testing'
    ],
    prerequisites: 'Anyone seeking to study faster, learn code, or pass professional exams.',
    deviceCompatibility: ['Kindle', 'iOS Books', 'Android Moon+ Reader', 'PC/Mac'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Neurobiology of Memory Consolidation',
        pageStart: 1,
        snippet: 'How synaptic plasticity creates permanent long-term memory traces.',
        isPreviewAvailable: true,
        content: [
          'Your brain is not a computer hard drive that mechanically records video and audio.',
          'Memory is an active reconstructive process. Synaptic pathways strengthen when neurons fire together under conditions of mild cognitive challenge.',
          'Passive reading feels comfortable because it creates the "illusion of competence." When you close the book and attempt active recall, you force your brain to rewire itself.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The 20-Minute Focus Protocol',
      content: [
        'Before starting your study sprint, physically move your phone into another room. Even having a silent smartphone in your peripheral vision reduces working memory capacity by 12%.'
      ]
    },
    reviews: [
      {
        id: 'rev-8',
        userName: 'Aisha Al-Mansoor',
        userRole: 'Medical Student',
        rating: 5,
        date: 'Oct 9, 2026',
        title: 'Raised my exam score from 68% to 92%',
        comment: 'Simple, direct, and heavily backed by neuroscience. The $4.99 price point is ridiculously cheap for how much value it provides.',
        verifiedPurchase: true,
        helpfulCount: 88
      }
    ]
  },
  {
    id: 'ebook-executive-productivity',
    title: 'Executive Productivity & Focus OS',
    subtitle: 'Systematizing High-Output Leadership, Energy Management, and Deep Work',
    author: {
      name: 'Helena Thorne',
      role: 'Executive Coach to Fortune 500 Leaders',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      credentials: 'Advisor to CEOs across Silicon Valley, London, and Singapore',
    },
    category: 'Career & Productivity',
    audience: 'professionals',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.92,
    reviewsCount: 260,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-slate-700 to-zinc-950',
    badge: 'Founder Choice',
    pages: 248,
    language: 'English',
    fileSize: '7.6 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-204-0',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'How top performers manage 60-hour workloads in 35 focused hours. Energy cycles, asynchronous team leadership, and delegating without micromanaging.',
    fullDescription: 'Modern knowledge workers are drowned in endless Slack pings, back-to-back video calls, and context-switching fatigue. This operating system helps founders and managers reclaim 15 hours every week through strict calendar architecture, asynchronous communication doctrines, and decision matrices.',
    keyTakeaways: [
      'Design your weekly rhythm: Maker Days vs Manager Days',
      'The Asynchronous-First rule that cuts internal meetings by 60%',
      'The Eisenhower-Thorne Delegation Matrix for multiplying team throughput',
      'Energy management: Circadian alignment, nutritional clarity, and deliberate recovery',
      'Quarterly OKR tracking systems that prevent corporate drift'
    ],
    prerequisites: 'For founders, directors, senior engineers, and team leaders.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Boox/Remarkable', 'Android'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Context-Switching Tax',
        pageStart: 1,
        snippet: 'Why checking email every 10 minutes destroys your creative cognitive capacity.',
        isPreviewAvailable: true,
        content: [
          'Research by Dr. Gloria Mark at UC Irvine shows that it takes an average of 23 minutes and 15 seconds to return to deep focus after a single interruption.',
          'If you check your notifications 15 times a day, you effectively never achieve peak analytical focus.',
          'High performance is not about doing more tasks; it is about protecting unbroken blocks of strategic attention.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The Zero-Slack Morning Rule',
      content: [
        'Never open communications tools before 11:00 AM. Dedicate the first 3 hours of your business day exclusively to your highest-leverage strategic project.'
      ]
    },
    reviews: [
      {
        id: 'rev-9',
        userName: 'Brian Hayes',
        userRole: 'VP of Product',
        rating: 5,
        date: 'Oct 7, 2026',
        title: 'Reclaimed my sanity as an executive',
        comment: 'Implementing the Maker vs Manager calendar alone doubled our engineering roadmap velocity. In-browser reader is remarkably smooth.',
        verifiedPurchase: true,
        helpfulCount: 45
      }
    ]
  },
  {
    id: 'ebook-b2b-sales-outbound',
    title: 'B2B Sales & Outbound Systems',
    subtitle: 'Close High-Ticket Enterprise Accounts with Predictable Automated Pipelines',
    author: {
      name: 'Christian Croft',
      role: 'Enterprise Revenue Architect',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      credentials: 'Generated $65M+ in closed B2B contracts across enterprise SaaS and agency services',
    },
    category: 'Marketing & Sales',
    audience: 'professionals',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.97,
    reviewsCount: 310,
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-blue-700 to-slate-900',
    badge: 'Bestseller',
    pages: 310,
    language: 'English',
    fileSize: '12.1 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-205-7',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The enterprise sales blueprint: identifying economic buyers, qualifying intent, objection handling matrices, and closing $20k-$100k contracts.',
    fullDescription: 'Stop relying on hope and random referrals. Build an automated prospecting and closing engine. Packed with multi-touch email cadences, discovery call frameworks, pricing proposals, and contract redlining tactics.',
    keyTakeaways: [
      'Map multi-stakeholder buyer committees inside mid-market & enterprise firms',
      'The 5-Question Discovery Call framework that uncovers hidden enterprise budget',
      'Create commercial proposals that close with an 82% acceptance rate',
      'Handle pricing resistance: "You are too expensive" and "We do this in-house"',
      'Automated follow-up cadences that keep stale deals alive'
    ],
    prerequisites: 'Entrepreneurs, account executives, agency owners, and sales professionals.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Windows Surface', 'Android'],
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Shift from Vendor to Trusted Strategic Advisor',
        pageStart: 1,
        snippet: 'Why corporate buyers despise product demos and crave business diagnosis.',
        isPreviewAvailable: true,
        content: [
          'Unsuccessful salespeople open meetings by clicking through slide decks and showcasing software features.',
          'Elite sales advisors act like orthopedic surgeons: they ask rigorous diagnostic questions, pinpoint acute structural pain, and prescribe an uncompromising surgical solution.',
          'When you diagnose before you prescribe, price resistance vanishes.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The Diagnostic Question Script',
      content: [
        '"If this problem remains unresolved over the next 12 months, what is the quantitative impact on your EBITDA and team headcount?"'
      ]
    },
    reviews: [
      {
        id: 'rev-10',
        userName: 'Mateo Morales',
        userRole: 'Agency Partner',
        rating: 5,
        date: 'Oct 5, 2026',
        title: 'Closed our largest deal to date ($48,000)!',
        comment: 'Used the exact discovery framework in Chapter 3 with a healthcare company. Paid back the book cost a thousand-fold.',
        verifiedPurchase: true,
        helpfulCount: 63
      }
    ]
  },
  {
    id: 'ebook-uiux-mastery',
    title: 'UI/UX Design Systems & Figma Mastery (2026 Edition)',
    subtitle: 'From Wireframing & Auto-Layout 5.0 to High-Converting Mobile & Web Experiences',
    author: {
      name: 'Mia Sterling',
      role: 'Principal Product Designer & Figma Community Leader',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      credentials: 'Ex-Airbnb Design Systems Architect; Creator of Figma UI kits with 120k+ downloads',
    },
    category: 'UI/UX Design',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.98,
    reviewsCount: 540,
    coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-pink-600 via-purple-600 to-indigo-800',
    badge: 'Bestseller',
    pages: 285,
    language: 'English',
    fileSize: '18.2 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-301-6',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The definitive hands-on UI/UX design manual. Master visual hierarchy, Figma variables, responsive grids, user research, and building a standout junior design portfolio.',
    fullDescription: 'Stop designing random pretty screens without user experience logic. This complete modern guide takes beginner designers and students step-by-step through user mental models, wireframing, color theory contrast, typography scales, Figma Auto-Layout 5.0 mastery, component sets, and interactive prototyping. Build 3 production-grade case studies that make hiring managers stop scrolling.',
    keyTakeaways: [
      'Master the 8pt grid system, fluid typography scales, and WCAG 2.2 AA accessibility',
      'Advanced Figma workflows: Auto-layout nested frames, variables, and component variants',
      'Conduct rapid user testing and usability friction audits with zero budget',
      'Design mobile apps utilizing thumb-friendly navigation and cognitive load reduction',
      'Structure a junior design portfolio case study that lands $70k–$100k entry roles'
    ],
    prerequisites: 'Suitable for beginners, students, self-taught designers, and front-end devs.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Windows Surface', 'Android Tablets'],
    bonusItems: [
      '40+ Figma UI Components (.fig template)',
      'WCAG 2.2 Accessibility Audit Checklist',
      'Design Hand-off & Spec Sheet Template'
    ],
    level: 'Beginner',
    readingTime: '3.5 hrs reading time',
    audioSampleAvailable: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Visual Hierarchy Playbook',
        pageStart: 1,
        snippet: 'How human eyes scan digital interfaces: F-patterns, Z-patterns, and the law of proximity.',
        isPreviewAvailable: true,
        content: [
          'Visual hierarchy is not about making elements flashy; it is about guiding the user\'s cognitive attention effortlessly through an interface.',
          'When a user opens your application, their eyes perform an instantaneous saccadic scan lasting roughly 50 milliseconds.',
          'If every element on the screen screams for attention with bold weights, saturated colors, and heavy borders, the interface becomes visually deafening.',
          'In this chapter, we establish the 3 Pillars of Hierarchy: Size Scaling (Major Third and Perfect Fourth ratios), Color Saturation vs Background Neutrality, and Spatial Grouping governed by the Gestalt principles.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: Figma Speedrunning & Auto-Layout 5.0',
        pageStart: 34,
        snippet: 'Mastering flexbox-like responsive layouts, constraints, and dynamic token variables.',
        isPreviewAvailable: true,
        content: [
          'Most beginner designers manually drag text boxes and rectangles, spending hours repositioning buttons when copy changes.',
          'Professional design systems leverage Auto-Layout nested logic where components breathe and resize organically like production CSS code.',
          'We break down hugs, fills, fixed sizing, min/max bounds, and negative spacing in 5 practical exercises.'
        ]
      },
      {
        id: 3,
        title: 'Chapter 3: Mobile UX Patterns & Micro-Friction',
        pageStart: 88,
        snippet: 'Thumb-zone ergonomic mapping and eliminating accidental taps on mobile viewports.',
        isPreviewAvailable: false,
        content: []
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The 60-30-10 Color Balance Rule',
      content: [
        'Apply 60% neutral background space (whites, off-whites, or deep obsidian for dark mode), 30% structural contrast (slate typography and card surfaces), and only 10% pure accent color for actionable interactive triggers like Primary CTAs and active states.',
        'When accent color exceeds 15% of surface area, button click-through rates decline by up to 28% due to visual fatigue.'
      ]
    },
    reviews: [
      {
        id: 'rev-ui-1',
        userName: 'Chloe Bennett',
        userRole: 'Junior UI Designer',
        rating: 5,
        date: 'Oct 11, 2026',
        title: 'The best Figma & UI book in existence, hands down!',
        comment: 'Mia explains why design choices work instead of just showing buttons. The included Figma starter kit (.fig file) is worth $100 by itself. Landed an internship within 3 weeks!',
        verifiedPurchase: true,
        helpfulCount: 89
      },
      {
        id: 'rev-ui-2',
        userName: 'Nathan Brooks',
        userRole: 'Front-End Bootcamp Student',
        rating: 5,
        date: 'Oct 9, 2026',
        title: 'Finally understood typography scales and auto-layout',
        comment: 'Downloaded the EPUB on my iPad and read the first 3 chapters immediately with the Look Inside reader. Super clear diagrams and clean formatting.',
        verifiedPurchase: true,
        helpfulCount: 47
      }
    ]
  },
  {
    id: 'ebook-enterprise-design-systems',
    title: 'The Enterprise Design System Playbook',
    subtitle: 'Architecting Multi-Brand Token Systems, Governance, and Scalable UX at Scale',
    author: {
      name: 'Aris Thorne',
      role: 'Staff Design Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      credentials: 'Led Design System teams across 4 FinTech and SaaS unicorns; Creator of TokenForge',
    },
    category: 'UI/UX Design',
    audience: 'professionals',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.97,
    reviewsCount: 380,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-violet-800 to-slate-950',
    badge: 'Founder Choice',
    pages: 360,
    language: 'English',
    fileSize: '22.5 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-302-3',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The enterprise manual for scaling design tokens, headless component primitives, multi-brand theming, and cross-functional team governance.',
    fullDescription: 'Building a component library is easy; maintaining a design system across 200+ engineers, multiple platforms (iOS, Android, Web), and evolving brands is one of the hardest engineering challenges in tech. This comprehensive playbook covers token tiers (Global, Alias, Component), automated CI/CD token pipelines with Style Dictionary, component versioning matrices, and calculating ROI for executive leadership.',
    keyTakeaways: [
      'Architect 3-tier semantic design tokens that support light/dark/high-contrast instantly',
      'Automate Figma-to-Code continuous integration using GitHub Actions and Token Studio',
      'Manage component deprecations, breaking changes, and migration scripts safely',
      'Build adoption analytics dashboards to prove $1.2M+ in engineering efficiency',
      'Design governance models: federated contributions vs centralized core system teams'
    ],
    prerequisites: 'Design system leads, senior product designers, UI engineers, and technical founders.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Desktop PDF', 'All E-readers'],
    bonusItems: [
      'Design Token JSON Schema Spec (.json)',
      'Component Audit Matrix Spreadsheet',
      'Figma Variant Architecture Template'
    ],
    level: 'Advanced',
    readingTime: '5.2 hrs reading time',
    audioSampleAvailable: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Anatomy of Semantic Token Architecture',
        pageStart: 1,
        snippet: 'Why hardcoding hex values in component libraries kills scalability.',
        isPreviewAvailable: true,
        content: [
          'A primitive token like "color-blue-500: #2563EB" conveys only raw value. It contains zero semantic intent.',
          'When you introduce an alias tier—"color-action-primary-default" pointing to "color-blue-500"—you decouple visual styling from component implementation.',
          'When your brand re-skins or launches dark mode, you do not rewrite 150 component files; you simply re-point the semantic alias token.',
          'In this chapter, we map out the complete 3-tier token taxonomy used by Stripe, GitHub Primer, and Shopify Polaris.'
        ]
      },
      {
        id: 2,
        title: 'Chapter 2: Figma to Code Synchronization Pipelines',
        pageStart: 52,
        snippet: 'How to automate tokens straight from Figma into Tailwind and React CSS variables.',
        isPreviewAvailable: true,
        content: [
          'Designers and developers should never manually sync colors or spacing values over Slack.',
          'We establish a single-source-of-truth Git repository where Figma token exports automatically trigger GitHub Actions to compile CSS, SCSS, Swift, and Android XML assets within 90 seconds.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The Token Naming Convention Law',
      content: [
        'Formula: [namespace]-[category]-[concept]-[property]-[state]\nExample: sys-color-surface-elevated-hover\n\nAdhering strictly to this standard prevents token collision and enables automated linting rules across massive front-end codebases.'
      ]
    },
    reviews: [
      {
        id: 'rev-ui-3',
        userName: 'Siddharth Rao',
        userRole: 'Staff UI Architect',
        rating: 5,
        date: 'Oct 8, 2026',
        title: 'Saved our engineering org 6 months of trial and error',
        comment: 'Every chapter tackles real-world friction. The token schema templates alone transformed our multi-brand mobile and web architecture. Indispensable for senior tech leads.',
        verifiedPurchase: true,
        helpfulCount: 74
      }
    ]
  },
  {
    id: 'ebook-microinteractions-psychology',
    title: 'Micro-Interactions & UX Psychology',
    subtitle: 'Designing Addictive, Frictionless Digital Products That Retain and Convert Users',
    author: {
      name: 'Dr. Camille Laurent',
      role: 'Cognitive Ergonomist & Head of Product Design',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      credentials: 'Ph.D. in Human-Computer Interaction; Keynote speaker at UX London & Interaction Week',
    },
    category: 'UI/UX Design',
    audience: 'professionals',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.95,
    reviewsCount: 295,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-amber-600 via-rose-600 to-indigo-900',
    badge: 'Trending',
    pages: 245,
    language: 'English',
    fileSize: '12.4 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-303-0',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'Master the cognitive drivers of user engagement: trigger-loop mechanics, motion curves, haptic feedback, and delightful subtle micro-animations.',
    fullDescription: 'Great products are not judged only by big features; they are loved for the tiny, delightful moments in between. Learn how pull-to-refresh, toggles, loading skeletons, error shakes, and button morphs tap into human dopamine feedback loops. Packed with motion timing curves (springs vs easings), accessibility for vestibular disorders, and conversion micro-copy.',
    keyTakeaways: [
      'The 4-Part Micro-Interaction Model: Triggers, Rules, Feedback, and Loops/Modes',
      'Animation choreography: Why 200ms–350ms is the cognitive sweet spot for UI motion',
      'Design delightful empty states and loading skeletons that decrease perceived wait time by 40%',
      'Haptic feedback and sound design guidelines for modern mobile interactions',
      'Prevent cognitive overload through progressive disclosure and contextual tooltips'
    ],
    prerequisites: 'Product designers, UI/UX leads, mobile developers, and product managers.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Android Tablets', 'Windows Surface'],
    bonusItems: [
      'CSS & Motion Easing Curve Presets (bezier codes)',
      'Micro-Interaction Friction Audit Checklist'
    ],
    level: 'Intermediate',
    readingTime: '3.1 hrs reading time',
    audioSampleAvailable: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Neuroscience of Digital Feedback',
        pageStart: 1,
        snippet: 'How the brain processes tactile and visual confirmation within 100 milliseconds.',
        isPreviewAvailable: true,
        content: [
          'When a user taps an interactive button on a glass screen, their fingertips receive zero mechanical feedback.',
          'Without immediate visual or haptic acknowledgment (within 100ms), the subconscious brain assumes the system has stalled or failed, triggering impatient repeated clicks.',
          'A subtle 150ms scale-down press state and color elevation reassures the motor cortex that their physical intent was recognized.',
          'In this chapter, we explore how microseconds make the difference between software feeling clunky vs alive and responsive.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The Skeleton Screen Effect',
      content: [
        'Spinners force users to watch a clock, increasing time anxiety. Skeleton screens simulate content shapes, shifting focus toward anticipated information and reducing perceived latency by over 38%.'
      ]
    },
    reviews: [
      {
        id: 'rev-ui-4',
        userName: 'Julian Vance',
        userRole: 'Senior Product Designer',
        rating: 5,
        date: 'Oct 7, 2026',
        title: 'Every UI designer should read this cover to cover',
        comment: 'Helped us redesign our mobile checkout micro-animations. Cart completion jumped by 14% after removing jarring transitions and adding button confirmation springs.',
        verifiedPurchase: true,
        helpfulCount: 51
      }
    ]
  },
  {
    id: 'ebook-design-to-code',
    title: 'Design to Code: The Modern UI Engineer\'s Handbook',
    subtitle: 'Bridging the Gap Between Figma Prototypes and Production React 19 & Tailwind CSS',
    author: {
      name: 'Kenji Sato',
      role: 'Staff Design Technologist & UI Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      credentials: 'Built design toolchains used by 50,000+ developers; Expert in accessible web components',
    },
    category: 'UI/UX Design',
    audience: 'students',
    price: 24.99,
    originalPrice: 49.99,
    rating: 4.93,
    reviewsCount: 410,
    coverImage: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80',
    colorTheme: 'from-blue-600 via-cyan-600 to-slate-900',
    badge: 'Student Pick',
    pages: 270,
    language: 'English',
    fileSize: '15.8 MB',
    publicationYear: 2026,
    isbn: '978-1-95432-304-7',
    formats: ['PDF', 'EPUB', 'MOBI', 'Web Reader'],
    shortDescription: 'The bridge between visual design and clean frontend code. Translate Figma auto-layout, typography, and responsive vectors into pristine Tailwind and React 19 code.',
    fullDescription: 'Are you a designer who wants to code, or a developer who struggles to make interfaces look polished? This practical handbook dissolves the boundary between Figma and React. Learn pixel-perfect CSS flexbox & grid translations, accessible ARIA roles, responsive typography clamps, and fluid motion libraries.',
    keyTakeaways: [
      'Translate any Figma auto-layout frame into pure Tailwind CSS classes in seconds',
      'Master responsive breakpoints without breaking component containment',
      'Implement accessible keyboard navigation (focus rings, tab traps, screen reader text)',
      'Animate components with fluid spring physics using modern motion libraries',
      'Build your own live documentation storybook for client or portfolio presentation'
    ],
    prerequisites: 'Basic HTML/CSS or Figma familiarity. Perfect for students & junior engineers.',
    deviceCompatibility: ['Kindle', 'iPad & Mac', 'Windows Surface', 'Android Tablets'],
    bonusItems: [
      '5 Production React 19 + Tailwind UI Components',
      'Responsive Breakpoint & Fluid Typography Matrix'
    ],
    level: 'Beginner',
    readingTime: '3.8 hrs reading time',
    audioSampleAvailable: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Mental Shift from Static Canvas to Fluid DOM',
        pageStart: 1,
        snippet: 'Why fixed pixel coordinates fail on real-world responsive screens.',
        isPreviewAvailable: true,
        content: [
          'Designers often treat Figma as a static 1440px by 900px canvas with absolute x/y coordinates.',
          'The real web is dynamic, responsive, and viewed across 4,000+ distinct device screen sizes and zoom configurations.',
          'When you understand how CSS Box Model, inline-block flow, and modern flex wraps behave, you design resilient interfaces that never clip, overlap, or truncate awkwardly.'
        ]
      }
    ],
    sampleExcerpt: {
      title: 'Excerpt from Chapter 1: The Fluid Typography Clamp',
      content: [
        'Instead of defining 12 separate media queries for heading sizes, use CSS clamp: font-size: clamp(1.5rem, 2.5vw + 1rem, 3rem); This smoothly scales headings across smartphones and 4K displays with zero layout thrashing.'
      ]
    },
    reviews: [
      {
        id: 'rev-ui-5',
        userName: 'Zoe Martinez',
        userRole: 'CS & Design Student',
        rating: 5,
        date: 'Oct 10, 2026',
        title: 'Helped me bridge the design-dev gap completely!',
        comment: 'Code examples are clean and modern. I can now convert my Figma files directly to Tailwind without guessing margins. Best $9.99 investment ever.',
        verifiedPurchase: true,
        helpfulCount: 62
      }
    ]
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'STUDENT20',
    discountPercent: 20,
    description: '20% Student Discount for all learners (Age 16–24 or student email)',
    audience: 'students',
  },
  {
    code: 'GROWTH20',
    discountPercent: 20,
    description: '20% Founder & Professional Scale Discount (Age 25–40)',
    audience: 'professionals',
  },
  {
    code: 'MNSID20',
    discountPercent: 20,
    description: '20% Storewide Welcome Discount across all digital ebooks',
  }
];

export const CATEGORIES_LIST = [
  'All Categories',
  'UI/UX Design',
  'Web Dev & AI',
  'Business & Startups',
  'Career & Productivity',
  'Marketing & Sales',
] as const;

