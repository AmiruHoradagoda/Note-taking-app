import { useCallback, useEffect, useState } from "react";

import { clearAuth, getToken, getUserId } from "../lib/apiClient";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(getToken()));
  }, []);

  const markAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    userId: getUserId(),
    markAuthenticated,
    logout,
  };
};
