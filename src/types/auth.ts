import type { User } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = User & AuthTokens;

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordResponse {
  resetPasswordToken: string;
}

export interface VerifyOtpPayload {
  resetPasswordToken: string;
  otp: string;
}

export interface ResetPasswordPayload {
  resetPasswordToken: string;
  newPassword: string;
}
