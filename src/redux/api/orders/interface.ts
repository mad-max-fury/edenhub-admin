export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type FulfillmentStatus =
  | "unfulfilled"
  | "fulfilled"
  | "shipped"
  | "delivered"
  | "returned";

export interface IOrderCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface IOrderItem {
  _id?: string;
  product?: string;
  variantId?: string;
  name: string;
  sku?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  attributes?: Record<string, unknown>;
}

export interface IOrderAddress {
  fullName: string;
  phone?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  addressCode?: string;
}

export interface IShipment {
  courier?: string;
  courierId?: string;
  serviceCode?: string;
  requestToken?: string;
  shipbubbleOrderId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  labelUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface ITimelineEntry {
  type: string;
  message: string;
  by?: string;
  at: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: IOrderCustomer | string;
  items: IOrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxAmount: number;
  grandTotal: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentProvider: string;
  paymentReference?: string;
  paymentAuthorizationUrl?: string;
  paidAt?: string;
  shippingAddress?: IOrderAddress;
  billingAddress?: IOrderAddress;
  shipment: IShipment;
  customerNote?: string;
  internalNote?: string;
  timeline: ITimelineEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface IOrderListQuery {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  customer?: string;
}

export interface IOrderStats {
  totalOrders: number;
  totalSales: number;
  fulfilled: number;
  unfulfilled: number;
  pending: number;
  completed: number;
}

export interface ICourierRate {
  courierId: string;
  courierName: string;
  serviceCode: string;
  amount: number;
  currency: string;
  deliveryEta?: string;
}

export interface IFetchRatesResult {
  requestToken: string;
  receiverAddressCode: string;
  couriers: ICourierRate[];
}

export interface IShipOrder {
  id: string;
  serviceCode: string;
  courierId: string;
  requestToken?: string;
}
