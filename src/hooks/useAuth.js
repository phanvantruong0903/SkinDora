import { useEffect, useState } from "react";
import axios from "../utils/axiosPrivate";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../utils/tokenStorage";
import { authEndpoints, userEndpoints } from "../config/api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user từ API /me
  const loadUser = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return setUser(null);
      const res = await axios.get(userEndpoints.me, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập
  const login = async ({ email, password }) => {
    const res = await axios.post(authEndpoints.login, { email, password });
    const { access_token, refresh_token } = res.data;
    await saveTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
    await loadUser();
    return res;
  };

  // Đăng xuất
  const logout = async () => {
    await clearTokens();
    setUser(null);
  };

  // Refresh accessToken (dùng trong axios interceptor)
  const refresh = async () => {
    const refreshToken = await getRefreshToken();
    const res = await axios.post(authEndpoints.refresh, {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token } = res.data;
    await saveTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
    return access_token;
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refresh,
  };
}
