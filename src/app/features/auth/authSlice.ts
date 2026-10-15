import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import secureStorage from "@/utils/secureStorage";
import { APP_CONSTANTS } from "@/utils/Constants";
import type { LoginResponse } from "@/types/auth";
import type { User } from "@/types/user";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: secureStorage.getItem<User>(APP_CONSTANTS.USER),
  accessToken: secureStorage.getItem<string>(APP_CONSTANTS.ACCESS_TOKEN),
  refreshToken: secureStorage.getItem<string>(APP_CONSTANTS.REFRESH_TOKEN),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login response = user fields + tokens
    setAuthCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { accessToken, refreshToken, ...user } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      secureStorage.setItem(APP_CONSTANTS.USER, user);
      secureStorage.setItem(APP_CONSTANTS.ACCESS_TOKEN, accessToken);
      secureStorage.setItem(APP_CONSTANTS.REFRESH_TOKEN, refreshToken);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      secureStorage.setItem(APP_CONSTANTS.ACCESS_TOKEN, action.payload);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      secureStorage.setItem(APP_CONSTANTS.USER, action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      secureStorage.removeItem(APP_CONSTANTS.USER);
      secureStorage.removeItem(APP_CONSTANTS.ACCESS_TOKEN);
      secureStorage.removeItem(APP_CONSTANTS.REFRESH_TOKEN);
    },
  },
});

export const { setAuthCredentials, setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
