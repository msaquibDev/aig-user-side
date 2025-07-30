"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (result?.ok) {
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      toast.error(result?.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#edf1f5] to-[#ffffff] px-6">
      <div className="grid md:grid-cols-2 rounded-lg overflow-hidden shadow-lg w-full max-w-3xl bg-white">
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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 underline -mt-1 mb-3"
          >
            Forgot Password?
          </Link>

          <Button
            type="submit"
            className="mt-4 bg-[#00509E] text-white hover:bg-[#003B73]"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm mt-2">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 underline">
              Sign up now
            </Link>
          </p>
        </form>

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
