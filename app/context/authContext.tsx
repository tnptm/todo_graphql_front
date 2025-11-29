"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import apolloClient from "../apollo";
import { LOGIN_MUTATION, ME_QUERY, REGISTER_MUTATION } from "../graphql/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

type User = Record<string, any> | null;
type AuthContextShape = {
  user: User;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: any }>;
  registerUser: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  validateSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // call graphql login mutation (expects a token in the response)
      const response = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { username, password },
      });

      // try multiple common shapes
      const token =
        response?.data?.tokenAuth?.token ||
        response?.data?.login?.token ||
        response?.data?.authenticate?.token ||
        response?.data?.token ||
        null;

      if (!token) {
        throw new Error("Authentication failed: no token returned.");
      }

      // store token for subsequent requests (assumes apollo link will read from localStorage or we pass headers explicitly)
      setStoredToken(token);

      // Optionally reset store so requests use updated auth information
      try {
        await apolloClient.resetStore();
      } catch (e) {
        // ignore reset errors
      }

      // fetch current user to populate context (pass header in case link doesn't pick up localStorage)
      const meRes = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: "network-only",
        context: { headers: { authorization: `JWT ${token}` } },
      });

      const currentUser = meRes?.data?.me || meRes?.data?.currentUser || null;
      setUser(currentUser);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setError(err);
      setUser(null);
      setStoredToken(null);
      setLoading(false);
      return { success: false, error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setError(null);
    setStoredToken(null);
    try {
      // clear client store to avoid leaking cached data
      await apolloClient.clearStore();
    } catch (e) {
      // ignore clear errors
    }
  }, []);


  const registerUser = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Register the user
      await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: { username, email, password },
      });

      // 2. If successful, log them in to get the token
      const loginResult = await login(username, password);
      if (!loginResult.success) {
        throw loginResult.error || new Error("Registration successful but login failed.");
      }

      return { success: true };
    } catch (err: any) {
      setError(err);
      setUser(null);
      setStoredToken(null);
      setLoading(false);
      return { success: false, error: err };
    }
  }, [login]);


  const validateSession = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading(false);
      setUser(null);
      return false;
    }

    setLoading(true);
    try {
      const res = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: "network-only",
        context: { headers: { authorization: `JWT ${token}` } },
      });
      const currentUser = res?.data?.me || res?.data?.currentUser || null;
      setUser(currentUser);
      setLoading(false);
      return true;
    } catch (err) {
      setUser(null);
      setStoredToken(null);
      setLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // on mount try to validate any existing session
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextShape = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    registerUser,
    validateSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
