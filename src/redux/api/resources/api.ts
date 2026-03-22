import { baseApi } from "@/redux/baseApi";
import type {
  IResourceInfo,
  IUploadResource,
  IUploadResourceInfo,
} from "./interface";
import type { IResponse } from "../genericInterface";
import { objectToFormData } from "@/utils/helpers";

const baseName = "/resources";

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation<IResponse<IUploadResourceInfo>, IUploadResource>({
      query: ({ params, file }) => ({
        url: `${baseName}/upload`,
        method: "POST",
        params,
        data: objectToFormData({ file }),
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),

    getResourceInfo: builder.query<IResponse<IResourceInfo>, { key: string }>({
      query: (params) => ({
        url: `${baseName}/info`,
        method: "GET",
        params,
      }),
    }),

    deleteResource: builder.mutation<IResponse, { key: string }>({
      query: (params) => ({
        url: `${baseName}`,
        method: "DELETE",
        params,
      }),
    }),
  }),
});

export const {
  useUploadMutation,
  useGetResourceInfoQuery,
  useDeleteResourceMutation,
} = resourceApi;
