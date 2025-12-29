import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  karma_points: number;
}

interface AppState {
  user: User | null;
  karmaPoints: number;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  addKarmaPoints: (points: number) => void;
  resetKarmaPoints: () => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      karmaPoints: 0,
      isAuthenticated: false,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        karmaPoints: user?.karma_points || 0 
      }),
      addKarmaPoints: (points) => set((state) => ({ 
        karmaPoints: state.karmaPoints + points 
      })),
      resetKarmaPoints: () => set({ karmaPoints: 0 }),
      logout: () => set({ user: null, isAuthenticated: false, karmaPoints: 0 }),
    }),
    {
      name: 'sanskrit-curious-storage',
    }
  )
);
