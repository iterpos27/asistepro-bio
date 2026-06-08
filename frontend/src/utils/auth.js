export const ACCESS_TOKEN_KEY = 'asistepro_access_token';
export const REFRESH_TOKEN_KEY = 'asistepro_refresh_token';
export const USER_KEY = 'asistepro_user';
export const EMPRESA_ID_KEY = 'asistepro_empresa_id';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}
