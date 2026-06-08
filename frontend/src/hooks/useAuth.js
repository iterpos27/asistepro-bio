import { useState } from 'react';
import { getStoredUser, hasAccessToken } from '../utils/auth';

export default function useAuth() {
  const [user, setUser] = useState(() => getStoredUser());

  return {
    user,
    setUser,
    isAuthenticated: hasAccessToken(),
  };
}
