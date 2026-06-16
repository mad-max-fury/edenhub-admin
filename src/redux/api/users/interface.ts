import type { IUser } from "../auth";

export interface IOnboardUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

export interface IUpdateUser {
  id: string;
  user: Partial<{
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber: string;
    profilePicture: string;
    state: string;
    city: string;
    country: string;
    isActive: boolean;
    notificationPreferences: Record<string, boolean>;
    twoFactorEnabled: boolean;
  }>;
}

export interface IUpdatedUser {
  params: { type: string };
  data: IUser;
}

export interface ICustomerStats {
  total: number;
  active: number;
  verified: number;
  newThisMonth: number;
}
