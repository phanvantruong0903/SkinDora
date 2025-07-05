import { useEffect, useState } from "react";
import axiosPrivate from "../../utils/axiosPrivate";
import axiosPublic from "../../utils/axiosPublic";

// Example sử dụng: const { data, loading, error, refetch } = useFetch('/users')

export default function useFetch(url, autoRun = true, isPublic = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoRun);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const client = isPublic ? axiosPublic : axiosPrivate;
      const res = await client.get(url);
      setData(res.data.data);
    } catch (err) {
      console.log(err?.response?.data || err.message || err);
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
