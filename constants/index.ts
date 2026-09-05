// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT: (id: string) => `/products/${id}`,
  CATEGORY: (slug: string) => `/products?q=${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_CONFIRMATION: '/checkout/confirmation',
  BUYER_DASHBOARD: '/dashboard/buyer',
  BUYER_ORDERS: '/dashboard/orders',
  BUYER_ORDER: (id: string) => `/dashboard/orders/${id}`,
  BUYER_PROFILE: '/buyer/profile',
  BUYER_ONBOARDING: '/onboarding',
  SUPPLIER_DASHBOARD: '/dashboard/supplier',
  SUPPLIER_PRODUCTS: '/supplier/products',
  SUPPLIER_PRODUCT_NEW: '/supplier/products/new',
  SUPPLIER_PRODUCT_EDIT: (id: string) => `/supplier/products/${id}/edit`,
  SUPPLIER_ORDERS: '/supplier/orders',
  SUPPLIER_ORDER: (id: string) => `/supplier/orders/${id}`,
  SUPPLIER_PROFILE: '/supplier/profile',
  SUPPLIER_ONBOARDING: '/supplier/onboarding',
} as const;

// ─── API Endpoints ────────────────────────────────────────────────────────────
export const API = {
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ME: '/api/auth/me',
  ONBOARDING_BUYER: '/api/onboarding/buyer',
  ONBOARDING_SUPPLIER: '/api/onboarding/supplier',
  PRODUCTS: '/api/products',
  PRODUCT: (id: string) => `/api/products/${id}`,
  CATEGORIES: '/api/categories',
  CART: '/api/cart',
  ORDERS: '/api/orders',
  ORDER: (id: string) => `/api/orders/${id}`,
  BUYER_PROFILE: '/api/buyer/profile',
  BUYER_ORDERS: '/api/buyer/orders',
  SUPPLIER_DASHBOARD: '/api/supplier/dashboard',
  SUPPLIER_PRODUCTS: '/api/supplier/products',
  SUPPLIER_ORDERS: '/api/supplier/orders',
  SUPPLIER_ORDER_STATUS: (id: string) => `/api/supplier/orders/${id}/status`,
  SUPPLIER_PROFILE: '/api/supplier/profile',
  UPLOAD_IMAGE: '/api/uploads/image',
  AI_CHAT: '/api/ai/chat',
  AI_SEARCH: '/api/ai/search',
  AI_RECOMMEND: '/api/ai/recommend',
  AI_COMPARE: '/api/ai/compare',
  AI_SIMILAR: '/api/ai/similar',
  AI_QA: '/api/ai/qa',
} as const;

// ─── Roles ───────────────────────────────────────────────────────────────────
export const ROLES = {
  BUYER: 'buyer',
  SUPPLIER: 'supplier',
} as const;

// ─── Order Statuses ───────────────────────────────────────────────────────────
export const ORDER_STATUSES = [
  'Pending',
  'Accepted',
  'Preparing',
  'Ready for Dispatch',
  'Completed',
] as const;

// ─── Categories ───────────────────────────────────────────────────────────────
export const DEFAULT_CATEGORIES = [
  { slug: 'cotton', name: 'Cotton', description: 'Combed, organic and blended cotton for apparel and home textiles.' },
  { slug: 'silk', name: 'Silk', description: 'Mulberry, charmeuse and dupioni silks with premium hand feel.' },
  { slug: 'linen', name: 'Linen', description: 'European flax linens, undyed and garment-washed.' },
  { slug: 'denim', name: 'Denim', description: 'Selvedge, stretch and recycled denim in mill quantities.' },
  { slug: 'wool', name: 'Wool & Suiting', description: 'Merino, tweed and worsted suiting fabrics.' },
  { slug: 'technical', name: 'Technical', description: 'Performance knits, membranes and recycled polyester.' },
  { slug: 'shirting', name: 'Shirting', description: 'Fine shirting fabrics for premium garments.' },
  { slug: 'home-furnishing', name: 'Home Furnishing', description: 'Upholstery and home textile fabrics.' },
  { slug: 'ethnic-wear', name: 'Ethnic Wear', description: 'Traditional and ethnic wear fabrics.' },
  { slug: 'sportswear', name: 'Sportswear', description: 'Performance and activewear fabrics.' },
] as const;

export const FABRIC_TYPES = [
  'Organic Cotton',
  'Combed Cotton',
  'Mulberry Silk',
  'European Flax Linen',
  'Selvedge Denim',
  'Merino Wool',
  'Recycled Polyester',
  'Cotton Blend',
  'Khadi',
  'Blended Silk',
  'Twill',
  'Polyester',
] as const;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

// ─── Upload Limits ────────────────────────────────────────────────────────────
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PRODUCT: 5,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// ─── AI Limits ────────────────────────────────────────────────────────────────
export const AI_LIMITS = {
  MAX_CONTEXT_PRODUCTS: 20,
  MAX_CONVERSATION_HISTORY: 10,
  MAX_COMPARE_PRODUCTS: 3,
  MAX_SIMILAR_PRODUCTS: 6,
  MAX_RECOMMENDATIONS: 6,
  HF_TIMEOUT_MS: 15000,
} as const;

// ─── Inventory ────────────────────────────────────────────────────────────────
export const INVENTORY = {
  LOW_STOCK_THRESHOLD: 5,
} as const;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const AUTH = {
  COOKIE_NAME: 'texora-auth',
  TOKEN_EXPIRES_IN: '7d',
  PASSWORD_MIN_LENGTH: 8,
} as const;
