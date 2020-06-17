import {useEffect, useState} from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscribed = false;
    if (!subscribed) {
      async function fetchData() {
        try {
          setIsLoading(true);
          const res = await fetch(url);
          const json = await res.json();
          setData(json);
          setIsLoading(false);
        } catch (e) {
          setError(e);
        }
      }
      fetchData();
    }
    return () => {
      subscribed = false;
    };
  }, [url]);

  return {data, isLoading, error};
};
