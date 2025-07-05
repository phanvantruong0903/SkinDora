import { useState } from "react";
import axios from "../api/axiosInstance";

// Example sử dụng: const { post, loading, error } = usePost('/login')

export default function usePost(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const post = async (body) => {
    try {
      setLoading(true);
      const res = await axios.post(url, body);
      setData(res.data.data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { post, data, loading, error };
}
