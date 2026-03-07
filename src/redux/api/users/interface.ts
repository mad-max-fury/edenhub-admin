import type { IUser } from "../auth";

export interface IOnboardUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  profilePicture: string;
  state: string;
  city: string;
  country: string;
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
  }>;
}

export interface IUpdatedUser {
  params: { type: string };
  data: IUser;
}
