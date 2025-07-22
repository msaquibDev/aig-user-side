import { create } from "zustand";

export type AbstractStatus = "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED";
export type AbstractType = "Poster" | "Presentation";

export type Abstract = {
  id: number;
  abstractId: string;
  title: string;
  type: AbstractType;
  category: string;
  authors: string;
  confirmAccuracy: boolean;
  status: AbstractStatus;
  lastModified: string;
};

type AbstractStore = {
  abstracts: Abstract[];
  isSidebarOpen: boolean;
  selectedAbstract: Abstract | null;

  addAbstract: (
    newAbstract: Omit<Abstract, "id" | "abstractId" | "status" | "lastModified">
  ) => void;
  updateAbstract: (id: number, updated: Partial<Abstract>) => void;
  deleteAbstract: (id: number) => void;
  getAbstractById: (id: number) => Abstract | undefined;

  openSidebar: (id?: number) => void;
  closeSidebar: () => void;
};

export const useAbstractStore = create<AbstractStore>((set, get) => ({
  abstracts: [
    {
      id: 1,
      abstractId: "IBD001",
      title: "Lorem ipsum dolor sit amet consectetur",
      type: "Poster",
      category: "Brachytherapy",
      authors: "Dr Venugopal Iyer\nDr Subhash",
      confirmAccuracy: false,
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
      confirmAccuracy: false,
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
      confirmAccuracy: false,
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
      confirmAccuracy: false,
      status: "REJECTED",
      lastModified: "2025-05-07T16:00:00",
    },
  ],
  isSidebarOpen: false,
  selectedAbstract: null,

  addAbstract: (data) =>
    set((state) => {
      const newId = state.abstracts.length
        ? Math.max(...state.abstracts.map((a) => a.id)) + 1
        : 1;
      const abstractId = `IBD${String(newId).padStart(3, "0")}`;
      return {
        abstracts: [
          ...state.abstracts,
          {
            ...data,
            id: newId,
            abstractId,
            status: "DRAFT",
            lastModified: new Date().toISOString(),
            confirmAccuracy: data.confirmAccuracy ?? false,
          },
        ],
        isSidebarOpen: false,
        selectedAbstract: null,
      };
    }),

  updateAbstract: (id, updated) =>
    set((state) => ({
      abstracts: state.abstracts.map((abs) =>
        abs.id === id
          ? {
              ...abs,
              ...updated,
              lastModified: new Date().toISOString(),
              confirmAccuracy:
                typeof updated.confirmAccuracy === "boolean"
                  ? updated.confirmAccuracy
                  : abs.confirmAccuracy, // ✅ persist checkbox
            }
          : abs
      ),
      isSidebarOpen: false,
      selectedAbstract: null,
    })),

  deleteAbstract: (id) =>
    set((state) => ({
      abstracts: state.abstracts.filter((abs) => abs.id !== id),
    })),

  getAbstractById: (id) => get().abstracts.find((abs) => abs.id === id),

  openSidebar: (id) => {
    const selected = id ? get().getAbstractById(id) ?? null : null;
    set({ selectedAbstract: selected, isSidebarOpen: true });
  },

  closeSidebar: () => set({ isSidebarOpen: false, selectedAbstract: null }),
}));
