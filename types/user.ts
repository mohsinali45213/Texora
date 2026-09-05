export type Role = 'buyer' | 'supplier';



export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface BuyerProfile {
  id?: string;
  userId?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  businessType: string;
  industry: string;
  interests?: string[];
  categoriesOfInterest?: string[];
  preferredFabrics?: string[];
  preferredFabricTypes?: string[];
  orderQuantity?: string;
  typicalOrderQuantity?: string;
  budgetRange: string;
  additionalPreferences?: string;
}

export interface SupplierProfile {
  id?: string;
  userId?: string;
  businessName: string;
  businessType: string;
  contactName?: string;
  email?: string;
  phone?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  addressLine?: string;
  city?: string;
  country?: string;
  operatingHours: string;
  categories?: string[];
  productCategories?: string[];
  fabricTypes?: string[];
  fabricTypesOffered?: string[];
  moq: number;
  about?: string;
  additionalInfo?: string;
}

export interface AuthState {
  user: User | null;
  buyerProfile?: BuyerProfile | null;
  supplierProfile?: SupplierProfile | null;
  isLoading: boolean;
}
