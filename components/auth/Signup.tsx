"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Smartphone,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import CountryStateCitySelect from "../common/CountryStateCitySelect";
import ReCAPTCHA from "react-google-recaptcha";
import { cn } from "@/lib/utils";

countries.registerLocale(enLocale);
// console.log("Saquib: .................", process.env.NEXT_PUBLIC_API_BASE_URL);

const schema = z
  .object({
    prefix: z.string().min(1, "Prefix is required"),
    name: z.string().min(1, "Full name is required"),
    affiliation: z.string().min(1, "Affiliation is required"),
    email: z.string().email("Please enter a valid email address"),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
    country: z.string().min(1, "Country is required"),
    password: z
      .string()
      .min(1, "Password is required")
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
    confirmPassword: z.string().min(1, "Please confirm your password"),
    termAndCondition: z.boolean().refine((val) => val, {
      message: "You must accept Terms & Conditions to proceed",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setError,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      prefix: "",
      name: "",
      affiliation: "",
      email: "",
      mobile: "",
      country: "",
      password: "",
      confirmPassword: "",
      termAndCondition: false,
    },
  });

  // Real-time validation feedback
  const handleInputChange = (field: keyof FormData) => {
    if (errors[field]) {
      clearErrors(field);
    }
  };

  const formatMobile = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setSubmitStatus("idle");

      // Validate reCAPTCHA
      // const recaptchaValue = recaptchaRef.current?.getValue();
      // if (!recaptchaValue) {
      //   toast.error("Please complete the reCAPTCHA verification");
      //   return;
      // }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            // recaptchaToken: recaptchaValue,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();

        // Handle specific error cases
        if (res.status === 409) {
          setError("email", {
            type: "manual",
            message: "This email is already registered",
          });
          toast.error("Email already exists. Please use a different email.");
        } else {
          toast.error(
            errorData.message || "Registration failed. Please try again."
          );
        }
        setSubmitStatus("error");
        return;
      }

      const result = await res.json();
      setSubmitStatus("success");
      toast.success(
        result.message || "Registration successful! Redirecting to login..."
      );

      // Reset form and redirect after delay
      setTimeout(() => {
        reset();
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      setSubmitStatus("error");
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setSubmitStatus("idle");
    recaptchaRef.current?.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-[#00509E] hover:text-[#003B73] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 rounded-2xl shadow-xl border-0 overflow-hidden bg-white">
          {/* Left Form Section */}
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-6 sm:p-8 md:p-10"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-[#00509E]" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Join us today and start your journey
                </p>
              </div>

              {/* Success/Error States */}
              {submitStatus === "success" ? (
                <div className="text-center space-y-6 py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 mb-2">
                      Registration Successful!
                    </h3>
                    <p className="text-green-600">
                      Redirecting you to login page...
                    </p>
                  </div>
                </div>
              ) : submitStatus === "error" ? (
                <div className="text-center space-y-6 py-4">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-700 mb-2">
                      Registration Failed
                    </h3>
                    <p className="text-red-600 mb-4">
                      There was an issue with your registration.
                    </p>
                    <Button
                      onClick={handleRetry}
                      className="bg-[#00509E] hover:bg-[#003B73] text-white px-8"
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Prefix */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="prefix"
                        className="text-sm font-medium text-gray-700"
                      >
                        Prefix <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="prefix"
                          placeholder="Mr / Ms / Dr / Prof"
                          {...register("prefix")}
                          onChange={(e) => {
                            register("prefix").onChange(e);
                            handleInputChange("prefix");
                          }}
                          className={cn(
                            "pl-10 border-2 focus:border-[#00509E] focus:ring-[#00509E] transition-colors",
                            errors.prefix ? "border-red-500" : "border-gray-300"
                          )}
                        />
                      </div>
                      {errors.prefix && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.prefix.message}
                        </p>
                      )}
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullname"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="fullname"
                          placeholder="Enter your full name"
                          {...register("name")}
                          onChange={(e) => {
                            register("name").onChange(e);
                            handleInputChange("name");
                          }}
                          className={cn(
                            "pl-10 border-2 focus:border-[#00509E] focus:ring-[#00509E] transition-colors",
                            errors.name ? "border-red-500" : "border-gray-300"
                          )}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Affiliation */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="affiliation"
                      className="text-sm font-medium text-gray-700"
                    >
                      Affiliation <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="affiliation"
                        placeholder="Your company, institution, or organization"
                        {...register("affiliation")}
                        onChange={(e) => {
                          register("affiliation").onChange(e);
                          handleInputChange("affiliation");
                        }}
                        className={cn(
                          "pl-10 border-2 focus:border-[#00509E] focus:ring-[#00509E] transition-colors",
                          errors.affiliation
                            ? "border-red-500"
                            : "border-gray-300"
                        )}
                      />
                    </div>
                    {errors.affiliation && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.affiliation.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        {...register("email")}
                        onChange={(e) => {
                          register("email").onChange(e);
                          handleInputChange("email");
                        }}
                        className={cn(
                          "pl-10 border-2 focus:border-[#00509E] focus:ring-[#00509E] transition-colors",
                          errors.email ? "border-red-500" : "border-gray-300"
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="mobile"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        {...register("mobile")}
                        onChange={(e) => {
                          const formatted = formatMobile(e.target.value);
                          e.target.value = formatted;
                          register("mobile").onChange(e);
                          handleInputChange("mobile");
                        }}
                        className={cn(
                          "pl-10 border-2 focus:border-[#00509E] focus:ring-[#00509E] transition-colors",
                          errors.mobile ? "border-red-500" : "border-gray-300"
                        )}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="w-full">
                        <CountryStateCitySelect
                          control={control}
                          watch={watch}
                          errors={errors}
                          showCountry={true}
                          disableCountry={false}
                          showState={false}
                          showCity={false}
                          showPincode={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...register("password")}
                        onChange={(e) => {
                          register("password").onChange(e);
                          handleInputChange("password");
                        }}
                        className={cn(
                          "pl-10 pr-10 border-2 focus:border-[#00509E] focus:ring-[#00509E] transition-colors",
                          errors.password ? "border-red-500" : "border-gray-300"
                        )}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...register("confirmPassword")}
                        onChange={(e) => {
                          register("confirmPassword").onChange(e);
                          handleInputChange("confirmPassword");
                        }}
                        className={cn(
                          "pl-10 pr-10 border-2 focus:border-[#00509E] focus:ring-[#00509E] transition-colors",
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        )}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* reCAPTCHA - Responsive */}
                  {/* <div className="mt-4 transform scale-90 sm:scale-95 md:scale-100 origin-left">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={
                        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                        "your_site_key"
                      }
                    />
                  </div> */}

                  {/* Terms & Conditions */}
                  {/* Terms & Conditions */}
                  <div className="flex items-start space-x-3 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox
                      id="termAndCondition"
                      checked={watch("termAndCondition")}
                      onCheckedChange={(checked) => {
                        // Convert Checkbox's CheckedState to boolean
                        const isChecked = checked === true;
                        // Update form value
                        setValue("termAndCondition", isChecked, {
                          shouldValidate: true,
                        });
                        // Clear any existing errors
                        if (errors.termAndCondition) {
                          clearErrors("termAndCondition");
                        }
                      }}
                      className={cn(
                        "mt-0.5 cursor-pointer data-[state=checked]:bg-[#00509E] data-[state=checked]:border-[#00509E]",
                        errors.termAndCondition && "border-red-500"
                      )}
                    />
                    <label
                      htmlFor="termAndCondition"
                      className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                    >
                      I agree to all{" "}
                      <Link
                        href="/terms"
                        className="text-[#00509E] underline hover:text-[#003B73] font-medium"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-[#00509E] underline hover:text-[#003B73] font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.termAndCondition && (
                    <p className="text-sm text-red-600 flex items-center gap-1 -mt-2">
                      <XCircle className="w-3 h-3" />
                      {errors.termAndCondition.message}
                    </p>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#00509E] to-[#003B73] hover:from-[#003B73] hover:to-[#00274D] text-white font-semibold py-3 text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </>
              )}

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#00509E] font-semibold hover:underline"
                >
                  Login now
                </Link>
              </p>
            </form>
          </div>

          {/* Right Image Section - Hidden on mobile, shown on lg screens */}
          <div className="hidden lg:block relative">
            <img
              src="/authImg/signup.png" // or use your image path
              alt="Professional community networking"
              className="h-full w-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center p-12"> */}
            <div className="text-center text-white space-y-6 max-w-md">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Welcome to Our Community</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Join thousands of professionals who are already using our
                platform to connect, learn, and grow together.
              </p>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Secure & Reliable Platform</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Easy to Use Interface</span>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
