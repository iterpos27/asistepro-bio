import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function useResource(path, fallback, deps = [], options = {}) {
  const enabled = options.enabled ?? true;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setData(fallback);
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    setLoading(true);
    api
      .get(path)
      .then((response) => {
        if (mounted) setData(response.data.data);
      })
      .catch(() => {
        if (mounted) setData(fallback);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [enabled, ...deps]);

  return { data, loading };
}
