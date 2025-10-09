  //app/store/useRegistrationStore.ts
  import { create } from "zustand";

  // Types
  // In your store/useRegistrationStore.ts
  export interface RegistrationCategory {
    _id: string;
    slabName: string; // Changed from categoryName
    amount: number;
    startDate?: string;
    endDate?: string;
  }

  // export type Gender = "Male" | "Female" | "Other";
  // export type MealPreference = "Veg" | "Non-Veg" | "Jain";
  // export type MealPreference = string; // now dynamic, not limited to 3

  // Main form type
  export type BasicDetails = {
    eventId: any;
    eventName: any;
    prefix?: string;
    fullName: string;
    email: string;
    phone: string;
    affiliation?: string;
    designation?: string;
    medicalCouncilRegistration: string;
    medicalCouncilState?: string;
    address?: string;
    country: string;
    state?: string;
    city?: string;
    pincode?: string;
    mealPreference?: string;
    gender?: string;
    registrationCategory: RegistrationCategory;
  };

  // Accompanying person type
  export type AccompanyingPerson = {
    name: string;
    age: string;
    gender: string;
    relation: string;
    mealPreference: string;
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
    skippedAccompanying: boolean;
    skippedWorkshops: boolean;

    setStep: (step: number) => void;
    updateBasicDetails: (data: Partial<BasicDetails>) => void;
    setAccompanyingPersons: (data: AccompanyingPerson[]) => void;
    skipAccompanyingPersons: () => void;
    setSelectedWorkshops: (workshops: string[]) => void;
    skipWorkshops: () => void;
    setBadgeInfo: (info: BadgeInfo) => void;
    resetForm: () => void;
  };

  // ✅ Initial values
  const initialBasicDetails: BasicDetails = {
    eventId: "",
    eventName: "",
    prefix: "",
    fullName: "",
    email: "",
    phone: "",
    affiliation: "",
    designation: "",
    medicalCouncilRegistration: "",
    medicalCouncilState: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    mealPreference: "",
    gender: "",
    registrationCategory: undefined as any,
  };

  export interface UserRegistration {
    _id: string;
    eventId: string;
    eventName: string;
    regNum: string;
    isPaid: boolean;
  }

  interface UserRegistrationsState {
    registrations: UserRegistration[];
    fetchRegistrations: () => Promise<void>;
  }

  export const useRegistrationStore = create<RegistrationState>((set) => ({
    currentStep: 1,
    basicDetails: initialBasicDetails,
    accompanyingPersons: [],
    selectedWorkshops: [],
    badgeInfo: null,

    // SKIP FLAGS INIT
    skippedAccompanying: false,
    skippedWorkshops: false,

    setStep: (step) => set({ currentStep: step }),

    updateBasicDetails: (data) =>
      set((state) => ({
        basicDetails: { ...state.basicDetails, ...data },
      })),

    setAccompanyingPersons: (data) =>
      set({ accompanyingPersons: data, skippedAccompanying: false }),

    skipAccompanyingPersons: () =>
      set({ accompanyingPersons: [], skippedAccompanying: true }),

    setSelectedWorkshops: (workshops) =>
      set({ selectedWorkshops: workshops, skippedWorkshops: false }),

    skipWorkshops: () => set({ selectedWorkshops: [], skippedWorkshops: true }),

    setBadgeInfo: (info) => set({ badgeInfo: info }),

    resetForm: () =>
      set({
        currentStep: 1,
        basicDetails: initialBasicDetails,
        accompanyingPersons: [],
        selectedWorkshops: [],
        badgeInfo: null,
        skippedAccompanying: false,
        skippedWorkshops: false,
      }),
  }));

// app/store/useRegistrationStore.ts
export const useUserRegistrationsStore = create<UserRegistrationsState>(
  (set) => ({
    registrations: [],
    fetchRegistrations: async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my/registrations`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!res.ok) {
          console.error("Failed to fetch user registrations");
          return;
        }

        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Transform the backend response to match our frontend structure
          const transformedRegistrations = data.data.map((reg: any) => ({
            _id: reg._id,
            eventId: reg.eventId?._id || reg.eventId,
            eventName: reg.eventId?.title || "Event",
            regNum: reg.regNum || `REG-${reg._id.slice(-6)}`,
            isPaid: reg.isPaid || false,
          }));
          
          set({ registrations: transformedRegistrations });
        }
      } catch (err) {
        console.error("Error loading user registrations", err);
      }
    },
  })
);
