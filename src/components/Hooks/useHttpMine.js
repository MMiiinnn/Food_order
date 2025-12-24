import { useCallback, useEffect, useState } from "react";

async function httpRequest({ url, config }) {
  const response = await fetch(url, config);
  const responseData = await response.json();

  if (!response.ok) {
    throw Error(responseData.message || "Can't fetch data from back-end");
  }

  return responseData;
}

export default function useHttp({ url, config }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async function fetchData() {
    setIsLoading(true);
    try {
      const resData = await httpRequest(url, config);
      setData(resData);
    } catch (error) {
      setError(resData.message || "Can't fetch data from back-end");
    }
    setIsLoading(false);
  });

  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      fetchData();
    }
  }, [fetchData, config]);

  return { data, isLoading, error, fetchData };
}
