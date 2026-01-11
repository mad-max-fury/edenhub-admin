import { type Dispatch, type SetStateAction } from "react";

export interface IPaginationQuery {
  pageNumber: number;
  pageSize: number;
  orderBy?: string;
  searchTerm?: string;
}

export interface IPaginationResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ITableProps<T> {
  tableData: T;
  setPageNumber: Dispatch<SetStateAction<number>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  loading: boolean;
}

export interface ISelectItemPropsWithValueGeneric {
  value: string | number;
  label: string;
}

export interface ISelectItemProps
  extends Omit<ISelectItemPropsWithValueGeneric, "value"> {
  value: string;
}

export const ATTESTATION_DOCUMENT_ENUM = 13;
