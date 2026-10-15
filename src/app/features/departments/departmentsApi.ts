import { API_URLS, RTK_TAGS } from "@/utils/Constants";
import { withQueryString } from "@/utils/Helpers";
import { api } from "../../services/baseApi";
import { invalidatesItem, listTag, providesItem, providesList, unwrapResponse } from "../../services/apiHelpers";
import type { QueryParams } from "@/types/api";
import type { Department, LookupPayload, UpdateLookupPayload } from "@/types/lookup";

const TAG = RTK_TAGS.DEPARTMENTS;

export const departmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], QueryParams | void>({
      query: (params) => withQueryString(API_URLS.DEPARTMENTS, params ?? {}),
      transformResponse: unwrapResponse<Department[]>,
      providesTags: providesList(TAG),
    }),
    getDepartment: builder.query<Department, string>({
      query: (id) => `${API_URLS.DEPARTMENTS}/${id}`,
      transformResponse: unwrapResponse<Department>,
      providesTags: providesItem(TAG),
    }),
    addDepartment: builder.mutation<Department, LookupPayload>({
      query: (body) => ({ url: API_URLS.DEPARTMENTS, method: "POST", body }),
      transformResponse: unwrapResponse<Department>,
      invalidatesTags: [listTag(TAG)],
    }),
    updateDepartment: builder.mutation<Department, UpdateLookupPayload>({
      query: ({ id, ...body }) => ({ url: `${API_URLS.DEPARTMENTS}/${id}`, method: "PATCH", body }),
      transformResponse: unwrapResponse<Department>,
      invalidatesTags: invalidatesItem(TAG),
    }),
    deleteDepartment: builder.mutation<null, string>({
      query: (id) => ({ url: `${API_URLS.DEPARTMENTS}/${id}`, method: "DELETE" }),
      invalidatesTags: invalidatesItem(TAG),
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
