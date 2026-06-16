import { baseApi } from "@/redux/baseApi";
import { tagTypes } from "@/redux/baseApi/tagTypes";

import type { IPaginatedResponse, IResponse } from "../genericInterface";
import type { IPaginationQuery } from "../interface";
import type {
  IAddAttribute,
  IBulkImportPayload,
  IBulkImportResult,
  ICategory,
  ICreateCategory,
  IRemoveAttribute,
  IUpdateAttribute,
  IUpdateCategory,
} from "./interface";

const baseName = "/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<IResponse<ICategory>, ICreateCategory>({
      query: (data) => ({
        url: `${baseName}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CATEGORIES },
        { type: tagTypes.GET_CATEGORIES_UNPAGINATED },
        { type: tagTypes.GET_CATEGORY_TREE },
      ],
    }),

    bulkCreateCategories: builder.mutation<
      IResponse<IBulkImportResult>,
      IBulkImportPayload
    >({
      query: (data) => ({
        url: `${baseName}/bulk`,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CATEGORIES },
        { type: tagTypes.GET_CATEGORIES_UNPAGINATED },
        { type: tagTypes.GET_CATEGORY_TREE },
      ],
    }),

    getCategories: builder.query<
      IPaginatedResponse<ICategory[]>,
      IPaginationQuery & { parent?: string }
    >({
      query: (params) => ({
        url: `${baseName}`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.GET_CATEGORIES }],
    }),

    getCategoriesUnpaginated: builder.query<IResponse<ICategory[]>, void>({
      query: () => ({
        url: `${baseName}/unpaginated`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_CATEGORIES_UNPAGINATED }],
    }),

    getCategoryTree: builder.query<IResponse<ICategory[]>, void>({
      query: () => ({
        url: `${baseName}/tree`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_CATEGORY_TREE }],
    }),

    getCategoryById: builder.query<IResponse<ICategory>, { id: string }>({
      query: ({ id }) => ({
        url: `${baseName}/${id}`,
        method: "GET",
      }),
      providesTags: [{ type: tagTypes.GET_CATEGORY }],
    }),

    updateCategoryById: builder.mutation<IResponse<ICategory>, IUpdateCategory>({
      query: ({ id, ...rest }) => ({
        url: `${baseName}/${id}`,
        method: "PATCH",
        data: rest,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CATEGORIES },
        { type: tagTypes.GET_CATEGORIES_UNPAGINATED },
        { type: tagTypes.GET_CATEGORY_TREE },
        { type: tagTypes.GET_CATEGORY },
      ],
    }),

    deleteCategoryById: builder.mutation<IResponse, { id: string }>({
      query: ({ id }) => ({
        url: `${baseName}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CATEGORIES },
        { type: tagTypes.GET_CATEGORIES_UNPAGINATED },
        { type: tagTypes.GET_CATEGORY_TREE },
      ],
    }),

    addCategoryAttribute: builder.mutation<IResponse<ICategory>, IAddAttribute>({
      query: ({ categoryId, attribute }) => ({
        url: `${baseName}/${categoryId}/attributes`,
        method: "POST",
        data: attribute,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CATEGORIES },
        { type: tagTypes.GET_CATEGORY_TREE },
        { type: tagTypes.GET_CATEGORY },
      ],
    }),

    updateCategoryAttribute: builder.mutation<
      IResponse<ICategory>,
      IUpdateAttribute
    >({
      query: ({ categoryId, attributeId, attribute }) => ({
        url: `${baseName}/${categoryId}/attributes/${attributeId}`,
        method: "PATCH",
        data: attribute,
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CATEGORIES },
        { type: tagTypes.GET_CATEGORY_TREE },
        { type: tagTypes.GET_CATEGORY },
      ],
    }),

    removeCategoryAttribute: builder.mutation<
      IResponse<ICategory>,
      IRemoveAttribute
    >({
      query: ({ categoryId, attributeId }) => ({
        url: `${baseName}/${categoryId}/attributes/${attributeId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: tagTypes.GET_CATEGORIES },
        { type: tagTypes.GET_CATEGORY_TREE },
        { type: tagTypes.GET_CATEGORY },
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useBulkCreateCategoriesMutation,
  useGetCategoriesQuery,
  useGetCategoriesUnpaginatedQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryByIdMutation,
  useDeleteCategoryByIdMutation,
  useAddCategoryAttributeMutation,
  useUpdateCategoryAttributeMutation,
  useRemoveCategoryAttributeMutation,
} = categoryApi;
