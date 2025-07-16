import { create } from "zustand";

// Types
export type RegistrationCategory =
  | "member"
  | "trade"
  | "student"
  | "non-member";
export type Gender = "male" | "female" | "other";
export type MealPreference = "veg" | "non-veg" | "jain";

// Main form type
export type BasicDetails = {
  prefix?: string;
  fullName: string;
  email: string;
  phone: string;
  affiliation?: string;
  designation?: string;
  registration: string;
  councilState?: string;
  address?: string;
  country: string;
  state?: string;
  city?: string;
  pincode?: string;
  mealPreference?: MealPreference;
  gender?: Gender;
  registrationCategory: RegistrationCategory;
};

// Accompanying person type
export type AccompanyingPerson = {
  name: string;
  age: string;
  gender: Gender;
  relation: string;
  mealPreference: MealPreference;
};

// Badge info type for success page
export type BadgeInfo = {
  qrCodeUrl: string;
  name: string;
  registrationId: string;
  category: string;
  workshop?: string;
};

// Zustand store shape
type RegistrationState = {
  currentStep: number;
  basicDetails: BasicDetails;
  accompanyingPersons: AccompanyingPerson[];
  selectedWorkshops: string[];
  badgeInfo: BadgeInfo | null;

  setStep: (step: number) => void;
  updateBasicDetails: (data: Partial<BasicDetails>) => void;
  setAccompanyingPersons: (data: AccompanyingPerson[]) => void;
  setSelectedWorkshops: (workshops: string[]) => void;
  setBadgeInfo: (info: BadgeInfo) => void;
  resetForm: () => void;
};

// ✅ Initial values
const initialBasicDetails: BasicDetails = {
  prefix: "",
  fullName: "",
  email: "",
  phone: "",
  affiliation: "",
  designation: "",
  registration: "",
  councilState: "",
  address: "",
  country: "India",
  state: "",
  city: "",
  pincode: "",
  mealPreference: undefined,
  gender: undefined,
  registrationCategory: "member",
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  currentStep: 1,
  basicDetails: initialBasicDetails,
  accompanyingPersons: [],
  selectedWorkshops: [],
  badgeInfo: null,

  setStep: (step) => set({ currentStep: step }),

  updateBasicDetails: (data) =>
    set((state) => ({
      basicDetails: { ...state.basicDetails, ...data },
    })),

  setAccompanyingPersons: (data) => set({ accompanyingPersons: data }),

  setSelectedWorkshops: (workshops) => set({ selectedWorkshops: workshops }),

  setBadgeInfo: (info) => set({ badgeInfo: info }),

  resetForm: () =>
    set({
      currentStep: 1,
      basicDetails: initialBasicDetails,
      accompanyingPersons: [],
      selectedWorkshops: [],
      badgeInfo: null,
    }),
}));
