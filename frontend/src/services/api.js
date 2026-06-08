import axios from 'axios';
import {
  ACCESS_TOKEN_KEY,
  EMPRESA_ID_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
} from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
});

const authApi = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  const empresaId = localStorage.getItem(EMPRESA_ID_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (empresaId) {
    config.headers['x-empresa-id'] = empresaId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const refreshToken = getRefreshToken();

    if (status === 401 && refreshToken && !originalRequest?._retry && !originalRequest?.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        const response = await authApi.post('/auth/refresh', { refreshToken });
        const { user, tokens } = response.data.data;

        setSession({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        });

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearSession();
        window.location.assign('/login');
        return Promise.reject(refreshError);
      }
    }

    if (status === 401) {
      clearSession();
      window.location.assign('/login');
    }

    return Promise.reject(error);
  },
);

export function setSession({ accessToken, refreshToken, user }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  if (user?.empresa_id) {
    localStorage.setItem(EMPRESA_ID_KEY, user.empresa_id);
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EMPRESA_ID_KEY);
}

export { getStoredUser };
