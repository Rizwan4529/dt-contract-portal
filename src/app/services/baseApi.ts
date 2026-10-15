import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { API_URLS, ENV, RTK_TAGS } from "@/utils/Constants";
import { getErrorMessage } from "@/utils/Helpers";
import { logout, setAccessToken } from "../features/auth/authSlice";
import type { ApiResponse } from "@/types/api";
import type { RefreshTokenResponse } from "@/types/auth";
import type { RootState } from "../store";

// Pass `meta: { silent: true }` in the query args (or extraOptions.silent) to skip the global toasts
type AppFetchArgs = FetchArgs & { meta?: { silent?: boolean } };
type AppExtraOptions = { silent?: boolean };

const TOAST_METHODS = ["POST", "PATCH", "PUT", "DELETE"];
// 401 on these means bad credentials, not an expired session
const NO_REAUTH_URLS: string[] = [
  API_URLS.LOGIN,
  API_URLS.REFRESH_TOKEN,
  API_URLS.FORGOT_PASSWORD,
  API_URLS.VERIFY_OTP,
  API_URLS.RESET_PASSWORD,
];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// Shared promise so parallel 401s trigger a single refresh call
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (api: Parameters<BaseQueryFn>[1], extraOptions: object) => {
  const refreshToken = (api.getState() as RootState).auth.refreshToken;
  if (!refreshToken) return null;

  const result = await rawBaseQuery(
    { url: API_URLS.REFRESH_TOKEN, method: "POST", body: { refreshToken } },
    api,
    extraOptions,
  );
  return (result.data as ApiResponse<RefreshTokenResponse> | undefined)?.data?.accessToken ?? null;
};

const baseQueryWithReauth: BaseQueryFn<string | AppFetchArgs, unknown, FetchBaseQueryError, AppExtraOptions> = async (
  args,
  api,
  extraOptions = {},
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args.url;

  if (result.error?.status === 401 && !NO_REAUTH_URLS.includes(url)) {
    refreshPromise ??= refreshAccessToken(api, extraOptions).finally(() => {
      refreshPromise = null;
    });
    const newAccessToken = await refreshPromise;

    if (newAccessToken) {
      api.dispatch(setAccessToken(newAccessToken));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  const method = (typeof args === "string" ? "GET" : (args.method ?? "GET")).toUpperCase();
  const silent = Boolean((typeof args !== "string" && args.meta?.silent) || extraOptions.silent);

  if (!silent && TOAST_METHODS.includes(method)) {
    if (result.error) {
      toast.error(getErrorMessage(result.error));
    } else {
      toast.success((result.data as ApiResponse<unknown> | null)?.message || "Action completed successfully!");
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(RTK_TAGS),
  endpoints: () => ({}),
});
