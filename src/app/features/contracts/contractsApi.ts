import { API_URLS, RTK_TAGS } from "@/utils/Constants";
import { withQueryString } from "@/utils/Helpers";
import { api } from "../../services/baseApi";
import { invalidatesItem, listTag, providesItem, providesList, unwrapResponse } from "../../services/apiHelpers";
import type { QueryParams } from "@/types/api";
import type { Contract, ContractPayload, UpdateContractPayload } from "@/types/contract";

const TAG = RTK_TAGS.CONTRACTS;

export const contractsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Supports exact-match filters: vendorId, departmentId, type, paymentStatus
    getContracts: builder.query<Contract[], QueryParams | void>({
      query: (params) => withQueryString(API_URLS.CONTRACTS, params ?? {}),
      transformResponse: unwrapResponse<Contract[]>,
      providesTags: providesList(TAG),
    }),
    getContract: builder.query<Contract, string>({
      query: (id) => `${API_URLS.CONTRACTS}/${id}`,
      transformResponse: unwrapResponse<Contract>,
      providesTags: providesItem(TAG),
    }),
    addContract: builder.mutation<Contract, ContractPayload>({
      query: (body) => ({ url: API_URLS.CONTRACTS, method: "POST", body }),
      transformResponse: unwrapResponse<Contract>,
      invalidatesTags: [listTag(TAG)],
    }),
    // Sending `attachments` replaces all existing documents
    updateContract: builder.mutation<Contract, UpdateContractPayload>({
      query: ({ id, ...body }) => ({ url: `${API_URLS.CONTRACTS}/${id}`, method: "PATCH", body }),
      transformResponse: unwrapResponse<Contract>,
      invalidatesTags: invalidatesItem(TAG),
    }),
    deleteContract: builder.mutation<null, string>({
      query: (id) => ({ url: `${API_URLS.CONTRACTS}/${id}`, method: "DELETE" }),
      invalidatesTags: invalidatesItem(TAG),
    }),
  }),
});

export const {
  useGetContractsQuery,
  useGetContractQuery,
  useAddContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
} = contractsApi;
