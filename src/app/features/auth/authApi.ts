import { API_URLS } from "@/utils/Constants";
import { api } from "../../services/baseApi";
import { unwrapResponse } from "../../services/apiHelpers";
import { setAuthCredentials, setUser } from "./authSlice";
import type {
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "@/types/auth";
import type { User } from "@/types/user";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({ url: API_URLS.LOGIN, method: "POST", body }),
      transformResponse: unwrapResponse<LoginResponse>,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthCredentials(data));
        } catch {
          // error toast handled globally in baseApi
        }
      },
    }),
    logout: builder.mutation<null, void>({
      query: () => ({ url: API_URLS.LOGOUT, method: "POST", meta: { silent: true } }),
    }),
    getMe: builder.query<User, void>({
      query: () => API_URLS.ME,
      transformResponse: unwrapResponse<User>,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // ignore
        }
      },
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>({
      query: (body) => ({ url: API_URLS.FORGOT_PASSWORD, method: "POST", body }),
      transformResponse: unwrapResponse<ForgotPasswordResponse>,
    }),
    verifyOtp: builder.mutation<ForgotPasswordResponse, VerifyOtpPayload>({
      query: (body) => ({ url: API_URLS.VERIFY_OTP, method: "POST", body }),
      transformResponse: unwrapResponse<ForgotPasswordResponse>,
    }),
    // Returns 204 (empty body) so the success toast is shown by the caller
    resetPassword: builder.mutation<null, ResetPasswordPayload>({
      query: (body) => ({ url: API_URLS.RESET_PASSWORD, method: "POST", body, meta: { silent: true } }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
