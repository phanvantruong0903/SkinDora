import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

// Example sử dụng: const { data, loading, error, refetch } = useFetch('/users')

export default function useFetch(url, autoRun = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoRun);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(url);
      setData(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRun) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
