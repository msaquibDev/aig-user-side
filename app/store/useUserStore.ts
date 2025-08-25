import { create } from "zustand";

interface UserState {
  photo: string | null;
  fullName: string;
  setUser: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  photo: "/authImg/user.png", // default
  fullName: "",
  setUser: (data) => set((state) => ({ ...state, ...data })),
}));
