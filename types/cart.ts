export interface CartItem {
  productId: string;
  quantity: number;
  priceAtAdd?: number;
  product?: {
    id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
    moq: number;
    supplierName: string;
    isAvailable: boolean;
  };
}

export interface Cart {
  id?: string;
  buyerId: string;
  items: CartItem[];
  total: number;
}

export interface CartSummary {
  items: CartItem[];
  total: number;
  count: number;
}
