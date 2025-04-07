import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  setToken: (token: string) => {
    sessionStorage.setItem("token", token);
    set({ token, isLoggedIn: true });
  },
  logout: () => {
    sessionStorage.removeItem("token");
    set({ token: null, isLoggedIn: false });
  },
  initializeAuth: () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      set({
        token,
        isLoggedIn: true,
      });
    } else {
      set({
        token: null,
        isLoggedIn: false,
      });
    }
  },
}));
