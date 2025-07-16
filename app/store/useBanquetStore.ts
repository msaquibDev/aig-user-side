// /app/store/useBanquetStore.ts
import { create } from "zustand";

export type BanquetPerson = {
  id: number;
  name: string;
  relation: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mealPreference: "Veg" | "Non-Veg" | "Jain";
};

type BanquetStore = {
  persons: BanquetPerson[];
  addPerson: (person: BanquetPerson) => void;
  updatePerson: (id: number, updated: BanquetPerson) => void;
  removePerson: (id: number) => void;
  getPersonById: (id: number) => BanquetPerson | undefined;
};

export const useBanquetStore = create<BanquetStore>((set, get) => ({
  persons: [
    {
      id: 1,
      name: "Dr. Sameer Sheikh",
      relation: "Colleague",
      age: 40,
      gender: "Male",
      mealPreference: "Veg",
    },
  ],
  addPerson: (person) =>
    set((state) => ({
      persons: [...state.persons, person],
    })),
  updatePerson: (id, updated) =>
    set((state) => ({
      persons: state.persons.map((p) => (p.id === id ? updated : p)),
    })),
  removePerson: (id) =>
    set((state) => ({
      persons: state.persons.filter((p) => p.id !== id),
    })),
  getPersonById: (id) => {
    return get().persons.find((p) => p.id === id);
  },
}));
