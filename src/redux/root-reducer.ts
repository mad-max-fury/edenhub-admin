import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "./baseApi";

const reducers = {
  [baseApi.reducerPath]: baseApi.reducer,
};

export const whitelist = [];
export const combineReducer = combineReducers<typeof reducers>(reducers);
