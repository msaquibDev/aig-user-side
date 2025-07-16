import { create } from "zustand";

export type AbstractStatus = "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED";

export type Abstract = {
  id: number;
  abstractId: string;
  title: string;
  type: "Poster" | "Presentation";
  category: string;
  authors: string;
  status: AbstractStatus;
  lastModified: string; // ISO string or formatted
};

type AbstractStore = {
  abstracts: Abstract[];
  addAbstract: (newAbstract: Abstract) => void;
  updateAbstract: (id: number, updated: Abstract) => void;
  deleteAbstract: (id: number) => void;
};

export const useAbstractStore = create<AbstractStore>((set) => ({
  abstracts: [
    {
      id: 1,
      abstractId: "IBD001",
      title: "Lorem ipsum dolor sit amet consectetur",
      type: "Poster",
      category: "Brachytherapy",
      authors: "Dr Venugopal Iyer\nDr Subhash",
      status: "DRAFT",
      lastModified: "2025-05-07T15:00:00",
    },
    {
      id: 2,
      abstractId: "IBD005",
      title: "Lorem ipsum dolor sit amet consectetur",
      type: "Presentation",
      category: "Brachytherapy",
      authors: "Dr Venugopal Iyer",
      status: "SUBMITTED",
      lastModified: "2025-05-07T16:00:00",
    },
    {
      id: 3,
      abstractId: "IBD081",
      title: "Lorem ipsum dolor sit amet consectetur",
      type: "Poster",
      category: "Brachytherapy",
      authors: "Dr Venugopal Iyer\nDr Subhash",
      status: "ACCEPTED",
      lastModified: "2025-05-07T15:00:00",
    },
    {
      id: 4,
      abstractId: "IBD007",
      title: "Lorem ipsum dolor sit amet consectetur",
      type: "Presentation",
      category: "Brachytherapy",
      authors: "Dr Venugopal Iyer",
      status: "REJECTED",
      lastModified: "2025-05-07T16:00:00",
    },
  ],
  addAbstract: (newAbstract) =>
    set((state) => ({
      abstracts: [...state.abstracts, newAbstract],
    })),
  updateAbstract: (id, updated) =>
    set((state) => ({
      abstracts: state.abstracts.map((abs) => (abs.id === id ? updated : abs)),
    })),
  deleteAbstract: (id) =>
    set((state) => ({
      abstracts: state.abstracts.filter((abs) => abs.id !== id),
    })),
}));
