"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  registerSchema,
  RegisterFormData,
} from "../schemas/auth.schema";

import { registerUser } from "../auth.api";

export default function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccessMessage(
        response.message || "Your account has been created successfully!"
      );

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData?.errors) {
          const firstError = Object.values(responseData.errors)
            .flat()
            .find(
              (message): message is string =>
                typeof message === "string"
            );

          setServerError(
            firstError || "Registration failed. Please try again."
          );

        } else {
          setServerError(
            responseData?.message ||
            "Something went wrong. Please try again."
          );
        }

      } else {
        setServerError("Unable to connect to the server.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >

      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Full Name
        </label>

        <input
          {...register("name")}
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Email Address
        </label>

        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Password
        </label>

        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Confirm Password
        </label>

        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your password"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Server Error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950"
        >
          {serverError}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
        >
          {successMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && (
          <Loader2 size={18} className="animate-spin" />
        )}

        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}

        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>

    </form>
  );
}