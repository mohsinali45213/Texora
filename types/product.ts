export interface Category {
  slug: string;
  name: string;
  description: string;
  productCount: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  fabricType: string;
  description: string;
  colors: string[];
  specifications: ProductSpecification[];
  stock: number;
  price: number;
  moq: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  images?: string[];
  // Convenience aliases used in UI (images[0])
  image?: string;
  gallery?: string[];
  supplierId: string;
  supplierName: string;
  leadTimeDays: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  q?: string;
  category?: string;
  fabricType?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}


