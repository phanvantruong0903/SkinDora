import { useState } from "react";
import axios from "../api/axiosInstance";

// Example sử dụng: const { put, loading, error } = usePut('/users/123')

export default function usePut(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const put = async (body) => {
    try {
      setLoading(true);
      const res = await axios.put(url, body);
      setData(res.data.data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { put, data, loading, error };
}
