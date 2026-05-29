import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: true, // Default to Dark Mode for SaaS vibe
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));

interface DocumentState {
  documents: any[];
  isUploading: boolean;
  setDocuments: (docs: any[]) => void;
  setUploading: (status: boolean) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  isUploading: false,
  setDocuments: (docs) => set({ documents: docs }),
  setUploading: (status) => set({ isUploading: status }),
}));
