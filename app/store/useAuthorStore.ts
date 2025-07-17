import { create } from "zustand";

export type Author = {
  id: number;
  name: string;
  department: string;
  institution: string;
  email: string;
  phone: string;
  abstractAssigned: string;
};

type AuthorState = {
  authors: Author[];
  selectedAuthorId: number | null;
  addAuthor: (author: Omit<Author, "id">) => void;
  updateAuthor: (id: number, updated: Partial<Author>) => void;
  deleteAuthor: (id: number) => void;
  selectAuthor: (id: number | null) => void;
  getAuthorById: (id: number | null) => Author | undefined;
};

export const useAuthorStore = create<AuthorState>((set, get) => ({
  authors: [
    {
      id: 1,
      name: "Dr. A. Sharma",
      department: "Radiation Oncology",
      institution: "AIIMS Delhi",
      email: "asharma@example.com",
      phone: "9876543210",
      abstractAssigned: "IBD001",
    },
    {
      id: 2,
      name: "Dr. N. Rao",
      department: "Medical Physics",
      institution: "Tata Memorial Hospital",
      email: "nrao@example.com",
      phone: "9123456789",
      abstractAssigned: "IBD005",
    },
    {
      id: 3,
      name: "Dr. R. Patel",
      department: "Radiology",
      institution: "PGI Chandigarh",
      email: "rpatel@example.com",
      phone: "9871234567",
      abstractAssigned: "Not Assigned",
    },
  ],
  selectedAuthorId: null,

  addAuthor: (author) =>
    set((state) => ({
      authors: [
        ...state.authors,
        {
          id: Date.now(),
          ...author,
        },
      ],
    })),

  updateAuthor: (id, updated) =>
    set((state) => ({
      authors: state.authors.map((a) =>
        a.id === id ? { ...a, ...updated } : a
      ),
    })),

  deleteAuthor: (id) =>
    set((state) => ({
      authors: state.authors.filter((a) => a.id !== id),
    })),

  selectAuthor: (id) => set({ selectedAuthorId: id }),

  getAuthorById: (id) => {
    const state = get();
    return state.authors.find((a) => a.id === id);
  },
}));
