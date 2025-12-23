/**
 * MenuItem Type
 * Represents a menu item in the restaurant POS system
 */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  ingredients?: string[];
  preparationTime?: number; // in minutes
  allergens?: string[];
}

/**
 * Order Type
 * Represents a customer order in the restaurant POS system
 */
export interface Order {
  id: string;
  orderNumber: number;
  timestamp: Date;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  customerId?: string;
  tableNumber?: number;
}

/**
 * OrderItem Type
 * Represents an individual item within an order
 */
export interface OrderItem {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
  modifications?: OrderModification[];
}

/**
 * OrderModification Type
 * Represents modifications made to an order item
 */
export interface OrderModification {
  name: string;
  value: string;
  priceAdjustment?: number;
}

/**
 * Order Status Enum
 * Represents the current status of an order
 */
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  SERVED = "served",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * Payment Method Enum
 * Represents the payment method used for an order
 */
export enum PaymentMethod {
  CASH = "cash",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  MOBILE_PAYMENT = "mobile_payment",
  GIFT_CARD = "gift_card",
}
