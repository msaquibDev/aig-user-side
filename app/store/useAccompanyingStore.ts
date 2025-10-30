import { create } from "zustand";
import { toast } from "sonner";

export type AccompanyingPerson = {
  id: number;
  name: string;
  relation: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mealPreference: string; // ✅ Updated to string to match API
};

type AccompanyingStore = {
  people: AccompanyingPerson[];
  addPerson: (person: AccompanyingPerson) => void;
  updatePerson: (id: number, updated: AccompanyingPerson) => void;
  removePerson: (id: number) => void;
  clearPeople: () => void;
};

export const useAccompanyingStore = create<AccompanyingStore>((set) => ({
  people: [],
  addPerson: (person) =>
    set((state) => ({
      people: [...state.people, person],
    })),
  updatePerson: (id, updated) =>
    set((state) => ({
      people: state.people.map((p) => (p.id === id ? updated : p)),
    })),
  removePerson: (id) =>
    set((state) => ({
      people: state.people.filter((p) => p.id !== id),
    })),
  clearPeople: () => set({ people: [] }),
}));
