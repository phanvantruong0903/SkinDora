import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../utils/tokenStorage";
import { authEndpoints } from "../config/api";

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;
    const isNotRetry = !originalRequest._retry;

    if (is401 && isNotRetry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        const res = await axios.post(authEndpoints.refresh, {
          refresh_token: refreshToken,
        });
        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;
        await saveTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        await clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
