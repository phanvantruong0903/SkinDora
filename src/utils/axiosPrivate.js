// utils/axiosPrivate.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./tokenStorage";
import { authEndpoints } from "../config/api";

const privateAxios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

privateAxios.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

privateAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;
    const isNotRetry = !originalRequest._retry;

    if (is401 && isNotRetry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        const res = await privateAxios.post(authEndpoints.refresh, {
          refresh_token: refreshToken,
        });
        const { access_token, refresh_token } = res.data;

        await saveTokens({
          accessToken: access_token,
          refreshToken: refresh_token,
        });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return privateAxios(originalRequest);
      } catch (err) {
        console.log("❌ Refresh token failed:", err?.response?.data || err.message);
        await clearTokens();
        return Promise.reject(err);
      }
    }

    console.log("❌ Axios error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default privateAxios;
