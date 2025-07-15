// /app/store/useAccompanyingStore.ts
import { create } from "zustand";

export type AccompanyingPerson = {
  id: number;
  name: string;
  relation: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mealPreference: "Veg" | "Non-Veg" | "Jain";
};

type AccompanyingStore = {
  people: AccompanyingPerson[];
  addPerson: (person: AccompanyingPerson) => void;
  updatePerson: (id: number, updated: AccompanyingPerson) => void;
  removePerson: (id: number) => void;
};

export const useAccompanyingStore = create<AccompanyingStore>((set) => ({
  people: [
    {
      id: 1,
      name: "Ayesha Khan",
      relation: "Wife",
      age: 30,
      gender: "Female",
      mealPreference: "Veg",
    },
    {
      id: 2,
      name: "Zaid Khan",
      relation: "Child",
      age: 5,
      gender: "Male",
      mealPreference: "Jain",
    },
  ],
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
}));
