import type { IPaginationMetadataResponse } from "./interface";

export interface IResponse<T = null> {
  status: number;
  message: string;
  data: T;
}
export interface IApiError {
  status: string;
  message: string;
  error?: {
    statusCode: number;
    status: string;
    isOperational: boolean;
  };
  stack?: string;
  success?: boolean;
}
export interface IPaginatedResponse<T = null> {
  message: string;
  data: {
    data: T;
    metadata: IPaginationMetadataResponse;
  };
  status: number;
}
