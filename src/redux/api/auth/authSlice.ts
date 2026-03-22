import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "./interface";

interface AuthState {
  user: IUser | null;
  access_token: string | null;
  refresh_token?: string | null;
}

const initialState: AuthState = {
  user: null,
  access_token: null,
  refresh_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: IUser;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.access_token = action.payload.accessToken;
      state.refresh_token = action.payload.refreshToken;
    },

    updateAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      Object.assign(state, action.payload);
    },

    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
    },
  },
});

export const { setCredentials, logout, updateAuth, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
