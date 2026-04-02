import { useState, useCallback } from 'react';
import apiClient from '../services/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({ data: null, isLoading: false, error: null });

  const request = useCallback(async (method: 'get' | 'post' | 'put' | 'delete', url: string, body?: unknown) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await apiClient({ method, url, data: body });
      setState({ data: res.data, isLoading: false, error: null });
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      setState(s => ({ ...s, isLoading: false, error: msg }));
      throw err;
    }
  }, []);

  return { ...state, request };
}
