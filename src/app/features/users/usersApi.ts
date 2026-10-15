import { API_URLS, RTK_TAGS } from "@/utils/Constants";
import { withQueryString } from "@/utils/Helpers";
import { api } from "../../services/baseApi";
import { invalidatesItem, listTag, providesItem, providesList, unwrapResponse } from "../../services/apiHelpers";
import { setUser } from "../auth/authSlice";
import type { RootState } from "../../store";
import type { QueryParams } from "@/types/api";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/user";

const TAG = RTK_TAGS.USERS;

interface LifecycleApi {
  dispatch: (action: unknown) => unknown;
  getState: () => unknown;
  queryFulfilled: Promise<{ data: User }>;
}

// Keep the logged-in user (header, profile) in sync when their own record is fetched / changed
async function syncCurrentUser({ dispatch, getState, queryFulfilled }: LifecycleApi) {
  try {
    const { data } = await queryFulfilled;
    if (data?._id && data._id === (getState() as RootState).auth.user?._id) dispatch(setUser(data));
  } catch {
    // error toast handled globally
  }
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Supports exact-match filters: role, status, departmentId
    getUsers: builder.query<User[], QueryParams | void>({
      query: (params) => withQueryString(API_URLS.USERS, params ?? {}),
      transformResponse: unwrapResponse<User[]>,
      providesTags: providesList(TAG),
    }),
    getUser: builder.query<User, string>({
      query: (id) => `${API_URLS.USERS}/${id}`,
      transformResponse: unwrapResponse<User>,
      providesTags: providesItem(TAG),
      onQueryStarted: (_id, api) => syncCurrentUser(api),
    }),
    addUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({ url: API_URLS.USERS, method: "POST", body }),
      transformResponse: unwrapResponse<User>,
      invalidatesTags: [listTag(TAG)],
    }),
    updateUser: builder.mutation<User, UpdateUserPayload>({
      query: ({ id, ...body }) => ({ url: `${API_URLS.USERS}/${id}`, method: "PATCH", body }),
      transformResponse: unwrapResponse<User>,
      invalidatesTags: invalidatesItem(TAG),
      onQueryStarted: (_payload, api) => syncCurrentUser(api),
    }),
    activateUser: builder.mutation<User, string>({
      query: (id) => ({ url: `${API_URLS.USERS}/${id}/activate`, method: "PATCH" }),
      transformResponse: unwrapResponse<User>,
      invalidatesTags: invalidatesItem(TAG),
    }),
    deactivateUser: builder.mutation<User, string>({
      query: (id) => ({ url: `${API_URLS.USERS}/${id}/deactivate`, method: "PATCH" }),
      transformResponse: unwrapResponse<User>,
      invalidatesTags: invalidatesItem(TAG),
    }),
    deleteUser: builder.mutation<null, string>({
      query: (id) => ({ url: `${API_URLS.USERS}/${id}`, method: "DELETE" }),
      invalidatesTags: invalidatesItem(TAG),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
} = usersApi;
