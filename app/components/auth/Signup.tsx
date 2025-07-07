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

const schema = z.object({
  prefix: z.string().min(1, "Required"),
  fullName: z.string().min(1, "Required"),
  affiliation: z.string().min(1, "Required"),
  email: z.string().email(),
  mobile: z.string().min(10).max(10),
  country: z.string().min(1, "Required"),
  password: z.string().min(6),
  agree: z
    .boolean()
    .refine((val) => val, { message: "You must accept Terms & Conditions" }),
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
  });

  useEffect(() => {
    const countryNames = countries.getNames("en", { select: "official" });
    const mapped = Object.entries(countryNames).map(([code, name]) => ({
      code,
      name,
    }));
    setCountryList(mapped);
  }, []);

  const onSubmit = (data: FormData) => {
    const captcha = recaptchaRef.current?.getValue();
    if (!captcha) {
      alert("Please verify ReCAPTCHA");
      return;
    }

    console.log(data);
    router.push("/account/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#edf1f5] to-[#ffffff] px-6">
      <div className="grid md:grid-cols-2 rounded-lg overflow-hidden shadow-lg w-full max-w-5xl bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 px-8 py-10"
        >
          <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

          <div className="grid gap-1">
            <Label htmlFor="prefix">Prefix</Label>
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
            <Label htmlFor="fullName">Full Name</Label>
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
            <Label htmlFor="affiliation">Affiliation</Label>
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
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              placeholder="Enter Mobile Number"
              {...register("mobile")}
            />
            {errors.mobile && (
              <p className="text-sm text-red-600">{errors.mobile.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="country">Country</Label>
            <Select onValueChange={(value) => setValue("country", value)}>
              <SelectTrigger id="country" className="cursor-pointer">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countryList.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
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
            <Label htmlFor="password">Password</Label>
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

          <div className="mt-2">
            <ReCAPTCHA ref={recaptchaRef} sitekey="your_site_key" />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="agree" {...register("agree")} />
            <label htmlFor="agree" className="text-sm">
              I agree to all{" "}
              <a href="#" className="text-blue-600 underline">
                Terms & Conditions
              </a>
            </label>
          </div>
          {errors.agree && (
            <p className="text-sm text-red-600">{errors.agree.message}</p>
          )}

          <Button
            type="submit"
            className="mt-4 bg-[#003B73] text-white hover:bg-[#00509E]"
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
