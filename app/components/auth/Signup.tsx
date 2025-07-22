"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const schema = z
  .object({
    prefix: z.string().min(1, "Required"),
    fullName: z.string().min(1, "Required"),
    affiliation: z.string().min(1, "Required"),
    email: z.string().email(),
    mobile: z
      .string()
      .regex(/^\d{10}$/, { message: "Mobile must be 10 digits" }),
    country: z.string().min(1, "Required"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
    agree: z
      .boolean()
      .refine((val) => val, { message: "You must accept Terms & Conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // this targets confirmPassword only
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();
  const [countryList, setCountryList] = useState<
    { code: string; name: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      agree: false,
      // ...other defaults like name, email etc
    },
  });

  useEffect(() => {
    const countryNames = countries.getNames("en", { select: "official" });
    const mapped = Object.entries(countryNames)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name)); // ✅ sort alphabetically
    setCountryList(mapped);
  }, []);

  const onSubmit = (data: FormData) => {
    const captcha = recaptchaRef.current?.getValue();
    if (!captcha) {
      alert("Please verify ReCAPTCHA");
      return;
    }

    console.log(data);
    recaptchaRef.current?.reset(); // ✅ Reset CAPTCHA
    router.push("/account/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[rgb(237,241,245)] to-[#ffffff] px-6">
      <div className="grid md:grid-cols-2 rounded-lg overflow-hidden shadow-lg w-full max-w-5xl bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 px-8 py-10"
        >
          <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

          <div className="grid gap-1">
            <Label htmlFor="prefix">
              Prefix<span className="text-red-500">*</span>
            </Label>
            <Input
              id="prefix"
              placeholder="Eg: Dr, Mr, Ms"
              {...register("prefix")}
            />
            {errors.prefix && (
              <p className="text-sm text-red-600">{errors.prefix.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="fullName">
              Full Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Enter Full Name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="affiliation">
              Affiliation<span className="text-red-500">*</span>
            </Label>
            <Input
              id="affiliation"
              placeholder="Enter Affiliation"
              {...register("affiliation")}
            />
            {errors.affiliation && (
              <p className="text-sm text-red-600">
                {errors.affiliation.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="email">
              Email<span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email Id"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="mobile">
              Mobile Number<span className="text-red-500">*</span>
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter Mobile Number"
              {...register("mobile")}
            />
            {errors.mobile && (
              <p className="text-sm text-red-600">{errors.mobile.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="country">
              Country<span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(value) => setValue("country", value)}>
              <SelectTrigger id="country" className="w-full cursor-pointer">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {countryList.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="password">
              Password<span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="confirmPassword">
              Confirm Password<span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="mt-2">
            <ReCAPTCHA ref={recaptchaRef} sitekey="your_site_key" />
          </div>

          <label
            htmlFor="agree"
            className="flex items-center space-x-2 mt-2 cursor-pointer"
          >
            <Checkbox
              id="agree"
              {...register("agree")}
              className="cursor-pointer"
            />
            <span className="text-sm">
              I agree to all{" "}
              <a href="#" className="text-[#00509E] underline">
                Terms & Conditions
              </a>
            </span>
          </label>

          {errors.agree && (
            <p className="text-sm text-red-600">{errors.agree.message}</p>
          )}

          <Button
            type="submit"
            className="mt-4 bg-[#00509E] text-white hover:bg-[#003B73]"
          >
            Sign Up
          </Button>

          <p className="text-sm mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 underline">
              Login now
            </a>
          </p>
        </form>

        {/* Right Image */}
        <div className="hidden md:block">
          <img
            src="/authImg/signup.png"
            alt="Signup"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
