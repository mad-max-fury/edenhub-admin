import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./api/auth/authSlice";
import { baseApi } from "./baseApi";

const reducers = {
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

export const whitelist = ["auth"];
export const combineReducer = combineReducers(reducers);
