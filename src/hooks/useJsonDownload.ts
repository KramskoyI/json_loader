import { useEffect, useRef, useState } from 'react';
import { DATA_SOURCE } from '../constants/dataSource';
import { loadUsersFromFile } from '../services/usersApi';
import type { UserRecord } from '../types/data';

export const useJsonDownload = function () {
  const [data, setData] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchData = async (): Promise<void> => {

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setData([]);
    setError(null);
    setProgress(0);

    try {
      const result = await loadUsersFromFile(
        DATA_SOURCE,
        controller.signal,
        setProgress,
      );

      setData(result);

    } catch (error) {

      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } else {
        setError('Unknown download error');
      }

    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const cancelRequest = () => {
    const controller = abortControllerRef.current;

    if (controller) {
      controller.abort();
      abortControllerRef.current = null;
      setError('Request was cancelled');
    }

    setLoading(false);
    setProgress(0);
  };

  return {
    data,
    loading,
    error,
    progress,
    fetchData,
    cancelRequest,
  };
};
