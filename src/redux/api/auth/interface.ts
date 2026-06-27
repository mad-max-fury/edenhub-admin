import type { IRole } from "../roles";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResData {
  twoFactorRequired?: boolean;
  twoFactorMethod?: "email" | "authenticator";
  email?: string;
  user: IUser;
  groups: any[];
  accessToken: string;
  refreshToken: string;
}

export interface IVerify2FAInput {
  email: string;
  code: string;
}

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  staffId?: string;
  role: IRole;
  phoneNumber: string;
  profilePicture?: string;
  isVerified: boolean;
  state: string;
  city: string;
  country: string;
  isActive: boolean;
  wishlist: unknown[];
  notificationPreferences?: Record<string, boolean>;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  email: string;
  newPassword: string;
  verificationCode: string;
}

export interface IVerifyGoogleCodeInput {
  code: string;
}
