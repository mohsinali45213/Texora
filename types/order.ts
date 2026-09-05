export type OrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'Preparing'
  | 'Ready for Dispatch'
  | 'Completed';

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Accepted',
  'Preparing',
  'Ready for Dispatch',
  'Completed',
];

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus | null> = {
  Pending: 'Accepted',
  Accepted: 'Preparing',
  Preparing: 'Ready for Dispatch',
  'Ready for Dispatch': 'Completed',
  Completed: null,
};

export interface ShippingInfo {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  supplierId?: string;
  name: string;
  image: string;
  price?: number;
  unitPrice?: number;
  quantity: number;
  supplierName: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  at: string | null;
}

export interface Order {
  id: string;
  reference: string;
  buyerId?: string;
  buyerName: string;
  buyerCompany: string;
  items: OrderItem[];
  shippingInfo?: ShippingInfo;
  shipping?: any;
  totalAmount?: number;
  total?: number;
  status: OrderStatus;
  timeline: OrderTimeline[];
  createdAt?: string;
  placedAt?: string;
  updatedAt?: string;
}
