import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type {
  IAddVariant,
  IBulkDiscountPayload,
  IBulkProductsPayload,
  IBulkProductsResult,
  IBulkStatusPayload,
  ICreateProduct,
  IProduct,
  IProductListQuery,
  IProductStats,
  IRemoveVariant,
  IUpdateProduct,
  IUpdateProductStatus,
  IUpdateVariant,
} from "./interface";

const baseName = "/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<IResponse<IProduct>, ICreateProduct>({
      query: (data) => ({
        url: `${baseName}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_PRODUCTS }],
    }),

    bulkCreateProducts: builder.mutation<
      IResponse<IBulkProductsResult>,
      IBulkProductsPayload
    >({
      query: (data) => ({
        url: `${baseName}/bulk`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_PRODUCTS }],
    }),

    getProducts: builder.query<IPaginatedResponse<IProduct[]>, IProductListQuery>(
      {
        query: (params) => ({
          url: `${baseName}`,
          method: "GET",
          params,
        }),
        providesTags: [{ type: tagTypes.GET_PRODUCTS }],
      },
    ),

    getProductStats: builder.query<IResponse<IProductStats>, void>({
      query: () => ({
        url: `${baseName}/stats`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_PRODUCT_STATS }],
    }),

    getProductById: builder.query<IResponse<IProduct>, { id: string }>({
      query: ({ id }) => ({
        url: `${baseName}/${id}`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_PRODUCT }],
    }),

    updateProductById: builder.mutation<IResponse<IProduct>, IUpdateProduct>({
      query: ({ id, ...rest }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data: rest,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_PRODUCTS },
        { type: tagTypes.GET_PRODUCT },
      ],
    }),

    updateProductStatus: builder.mutation<
      IResponse<IProduct>,
      IUpdateProductStatus
    >({
      query: ({ id, status }) => ({
        url: `${baseName}/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: [
        { type: tagTypes.GET_PRODUCTS },
        { type: tagTypes.GET_PRODUCT },
      ],
    }),

    deleteProductById: builder.mutation<IResponse, { id: string }>({
      query: ({ id }) => ({
        url: `${baseName}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tagTypes.GET_PRODUCTS }],
    }),

    addVariant: builder.mutation<IResponse<IProduct>, IAddVariant>({
      query: ({ productId, variant }) => ({
        url: `${baseName}/${productId}/variants`,
        method: "POST",
        data: variant,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_PRODUCTS },
        { type: tagTypes.GET_PRODUCT },
      ],
    }),

    updateVariant: builder.mutation<IResponse<IProduct>, IUpdateVariant>({
      query: ({ productId, variantId, variant }) => ({
        url: `${baseName}/${productId}/variants/${variantId}`,
        method: "PATCH",
        data: variant,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_PRODUCTS },
        { type: tagTypes.GET_PRODUCT },
      ],
    }),

    removeVariant: builder.mutation<IResponse<IProduct>, IRemoveVariant>({
      query: ({ productId, variantId }) => ({
        url: `${baseName}/${productId}/variants/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.GET_PRODUCTS },
        { type: tagTypes.GET_PRODUCT },
      ],
    }),

    bulkUpdateStatus: builder.mutation<IResponse, IBulkStatusPayload>({
      query: (data) => ({
        url: `${baseName}/bulk/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_PRODUCTS }],
    }),

    bulkUpdateDiscount: builder.mutation<IResponse, IBulkDiscountPayload>({
      query: (data) => ({
        url: `${baseName}/bulk/discount`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.GET_PRODUCTS }],
    }),

    getLowStockProducts: builder.query<IResponse<IProduct[]>, void>({
      query: () => ({
        url: `${baseName}/low-stock`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_PRODUCTS }],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useBulkCreateProductsMutation,
  useGetProductStatsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useUpdateProductStatusMutation,
  useDeleteProductByIdMutation,
  useAddVariantMutation,
  useUpdateVariantMutation,
  useRemoveVariantMutation,
  useBulkUpdateStatusMutation,
  useBulkUpdateDiscountMutation,
  useGetLowStockProductsQuery,
} = productApi;
