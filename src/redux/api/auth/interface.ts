import type { IRole } from "../roles";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResData {
  user: IUser;
  groups: any[];
  accessToken: string;
  refreshToken: string;
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
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  password: string;
  passwordConfirmation: string;
}

export interface IVerifyGoogleCodeInput {
  code: string;
}
