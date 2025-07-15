import { create } from "zustand";

export type Workshop = {
  id: number;
  name: string;
  date: string;
  type: string; // "Pre Conference" | "Post Conference"
  venue: string;
  price: number;
  group: string; // used for grouping in form sidebar
};

type WorkshopStore = {
  workshops: Workshop[];
  selectedWorkshops: Record<string, number | null>;
  groupedWorkshops: Record<string, Workshop[]>;
  addWorkshop: (workshop: Workshop) => void;
  updateWorkshop: (id: number, updated: Workshop) => void;
  removeWorkshop: (id: number) => void;
  selectWorkshop: (group: string, id: number | null) => void;
};

export const useWorkshopStore = create<WorkshopStore>((set, get) => ({
  workshops: [
    {
      id: 1,
      name: "Advanced Surgical Techniques",
      date: "2025-08-10",
      type: "Pre Conference",
      venue: "Hall A",
      price: 3500,
      group: "Pre Conference Workshop",
    },
    {
      id: 2,
      name: "AI in Dentistry",
      date: "2025-08-11",
      type: "Post Conference",
      venue: "Hall B",
      price: 4500,
      group: "Post Conference Workshop",
    },
    {
      id: 3,
      name: "Workshop Not Required",
      date: "",
      type: "",
      venue: "",
      price: 0,
      group: "Pre Conference Workshop",
    },
  ],

  selectedWorkshops: {
    "Pre Conference Workshop": null,
    "Post Conference Workshop": null,
  },

  get groupedWorkshops() {
    const groups: Record<string, Workshop[]> = {};
    for (const workshop of get().workshops) {
      if (!groups[workshop.group]) groups[workshop.group] = [];
      groups[workshop.group].push(workshop);
    }
    return groups;
  },

  addWorkshop: (workshop) =>
    set((state) => ({
      workshops: [...state.workshops, workshop],
    })),

  updateWorkshop: (id, updated) =>
    set((state) => ({
      workshops: state.workshops.map((w) => (w.id === id ? updated : w)),
    })),

  removeWorkshop: (id) =>
    set((state) => ({
      workshops: state.workshops.filter((w) => w.id !== id),
    })),

  selectWorkshop: (group, id) =>
    set((state) => ({
      selectedWorkshops: {
        ...state.selectedWorkshops,
        [group]: id,
      },
    })),
}));
