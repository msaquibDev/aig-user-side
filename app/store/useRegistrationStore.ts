import { create } from "zustand";

// 🟩 Shared Gender type for strict type checking
type RegistrationCategory = "member" | "trade" | "student" | "non-member";
type Gender = "male" | "female" | "other";
type MealPreference = "veg" | "non-veg" | "jain"; // adjust as needed

type BasicDetails = {
  prefix: string;
  fullName: string;
  email: string;
  phone: string;
  affiliation?: string;
  designation?: string;
  medicalCouncilRegistration?: string;
  medicalCouncilState?: string;
  addressLine1?: string;
  country: string;
  state?: string;
  city?: string;
  pincode?: string;
  mealPreference?: MealPreference;
  gender: Gender;
  registrationCategory: RegistrationCategory;
};

// ✅ Also use Gender here for consistency
type AccompanyingPerson = {
  name: string;
  age: string;
  gender: Gender;
};

type RegistrationState = {
  currentStep: number;
  basicDetails: BasicDetails;
  accompanyingPerson?: AccompanyingPerson;
  selectedWorkshops: string[];

  setStep: (step: number) => void;
  updateBasicDetails: (data: Partial<BasicDetails>) => void;
  updateAccompanyingPerson: (data: Partial<AccompanyingPerson>) => void;
  setSelectedWorkshops: (workshops: string[]) => void;
  resetForm: () => void;
};

const initialBasicDetails: BasicDetails = {
  prefix: "",
  fullName: "",
  email: "",
  phone: "",
  affiliation: "",
  designation: "",
  medicalCouncilRegistration: "",
  medicalCouncilState: "",
  addressLine1: "",
  country: "India",
  state: "",
  city: "",
  pincode: "",
  mealPreference: undefined,
  gender: "male",
  registrationCategory: "member",
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  currentStep: 1,
  basicDetails: initialBasicDetails,
  accompanyingPerson: undefined,
  selectedWorkshops: [],

  setStep: (step) => set({ currentStep: step }),

  updateBasicDetails: (data) =>
    set((state) => ({
      basicDetails: { ...state.basicDetails, ...data },
    })),

  updateAccompanyingPerson: (data) =>
    set((state) => ({
      accompanyingPerson: {
        ...(state.accompanyingPerson ?? {
          name: "",
          age: "",
          gender: "male", // ✅ Default must match Gender
        }),
        ...data,
      },
    })),

  setSelectedWorkshops: (workshops) => set({ selectedWorkshops: workshops }),

  resetForm: () =>
    set({
      currentStep: 1,
      basicDetails: initialBasicDetails,
      accompanyingPerson: undefined,
      selectedWorkshops: [],
    }),
}));
