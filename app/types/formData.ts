import {
  // Gender,
  MealPreference,
  RegistrationCategory,
} from '@/app/store/useRegistrationStore'

export type FormData = {
  prefix: string;
  fullName: string;
  email: string;
  phone: string;
  affiliation?: string;
  designation?: string;
  registration?: string;
  councilState?: string;
  address?: string;
  country: string;
  state?: string;
  city?: string;
  pincode?: string;
  mealPreference: MealPreference;
  // gender: Gender;
  registrationCategory: RegistrationCategory;
};
