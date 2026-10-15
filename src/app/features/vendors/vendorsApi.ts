import { API_URLS, RTK_TAGS } from "@/utils/Constants";
import { withQueryString } from "@/utils/Helpers";
import { api } from "../../services/baseApi";
import { invalidatesItem, listTag, providesItem, providesList, unwrapResponse } from "../../services/apiHelpers";
import type { QueryParams } from "@/types/api";
import type { LookupPayload, UpdateLookupPayload, Vendor } from "@/types/lookup";

const TAG = RTK_TAGS.VENDORS;

export const vendorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<Vendor[], QueryParams | void>({
      query: (params) => withQueryString(API_URLS.VENDORS, params ?? {}),
      transformResponse: unwrapResponse<Vendor[]>,
      providesTags: providesList(TAG),
    }),
    getVendor: builder.query<Vendor, string>({
      query: (id) => `${API_URLS.VENDORS}/${id}`,
      transformResponse: unwrapResponse<Vendor>,
      providesTags: providesItem(TAG),
    }),
    addVendor: builder.mutation<Vendor, LookupPayload>({
      query: (body) => ({ url: API_URLS.VENDORS, method: "POST", body }),
      transformResponse: unwrapResponse<Vendor>,
      invalidatesTags: [listTag(TAG)],
    }),
    updateVendor: builder.mutation<Vendor, UpdateLookupPayload>({
      query: ({ id, ...body }) => ({ url: `${API_URLS.VENDORS}/${id}`, method: "PATCH", body }),
      transformResponse: unwrapResponse<Vendor>,
      invalidatesTags: invalidatesItem(TAG),
    }),
    deleteVendor: builder.mutation<null, string>({
      query: (id) => ({ url: `${API_URLS.VENDORS}/${id}`, method: "DELETE" }),
      invalidatesTags: invalidatesItem(TAG),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
