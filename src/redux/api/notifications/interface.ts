export type NotificationType =
  | "order"
  | "payment"
  | "stock"
  | "review"
  | "customer"
  | "system";

export interface INotification {
  _id: string;
  audience: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface INotificationMetadata {
  pageSize: number;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface INotificationsResponse {
  status: number;
  data: {
    data: INotification[];
    metadata: INotificationMetadata;
  };
}
