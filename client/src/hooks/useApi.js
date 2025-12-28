import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useApi() {
    const { token, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (endpoint, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...options.headers
                }
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    logout();
                }
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token, logout]);

    const get = useCallback((endpoint) => request(endpoint), [request]);

    const post = useCallback((endpoint, body) =>
        request(endpoint, { method: 'POST', body: JSON.stringify(body) }), [request]);

    const put = useCallback((endpoint, body) =>
        request(endpoint, { method: 'PUT', body: JSON.stringify(body) }), [request]);

    const del = useCallback((endpoint) =>
        request(endpoint, { method: 'DELETE' }), [request]);

    return { get, post, put, del, loading, error };
}

export default useApi;
