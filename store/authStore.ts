import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    Username: string;
    FullName: string;
    Gender: string; 
    Email: string;
    RegistrationIP: string;
    UserID: number;
    avatarLink: string | null;
    Bio: string | null;
    BirthPlace: string | null; 
    CurrentAdd: string | null;
    Phone: string | null;
    role: boolean;
  }

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
}

interface AuthActions {
    login: (user: User, accessToken: string, refreshToken: string, userId: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearAuthState: () => void;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    userId: null,
};

const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            ...initialState,

            login: (user, accessToken, refreshToken, userId) => set({
                isAuthenticated: true,
                user,
                accessToken,
                refreshToken,
                userId,
            }),

            logout: () => set(initialState),

            updateUser: (userData) => set((state) => ({
                user: state.user ? { ...state.user, ...userData } : null,
            })),

            setTokens: (accessToken, refreshToken) => set({
                accessToken,
                refreshToken,
            }),

            clearAuthState: () => set(initialState),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                userId: state.userId,
            }),
        }
    )
);

export default useAuthStore;