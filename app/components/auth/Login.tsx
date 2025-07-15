"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import ReCAPTCHA from "react-google-recaptcha"; // Temporarily disabled
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Spinner icon

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

const dummyCredentials = {
  email: "test@admin.com",
  password: "password123",
};

export default function Login() {
  // const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setIsLoading(true);

    // Simulate async login delay
    setTimeout(() => {
      if (
        data.email === dummyCredentials.email &&
        data.password === dummyCredentials.password
      ) {
        console.log("Dummy login success:", data);
        router.push("/dashboard");
      } else {
        alert("Invalid dummy credentials.");
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#edf1f5] to-[#ffffff] px-6">
      <div className="grid md:grid-cols-2 rounded-lg overflow-hidden shadow-lg w-full max-w-3xl bg-white">
        {/* Left Form Panel */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 px-8 py-10"
        >
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email id"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
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

          <a href="#" className="text-sm text-blue-600 underline -mt-1 mb-3">
            Forgot Password?
          </a>

          {/* ReCAPTCHA - disabled temporarily */}
          {/*
          <div className="mb-3">
            <ReCAPTCHA ref={recaptchaRef} sitekey="your_site_key" />
          </div>
          */}

          <Button
            type="submit"
            className="bg-[#00509E] text-white hover:bg-[#003B73] flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-sm mt-2">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 underline">
              Sign up now
            </a>
          </p>
        </form>

        {/* Right Image Panel */}
        <div className="hidden md:block">
          <img
            src="/authImg/login.png"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
