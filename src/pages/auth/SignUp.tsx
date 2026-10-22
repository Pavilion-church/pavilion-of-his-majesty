import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

const sanitizeName = (value: string) =>
  value
    .replace(/[^\p{L}\s'-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 50);

const sanitizePhone = (value: string) => {
  const cleaned = value.replace(/[^\d+ ()-]/g, "");

  return (
    cleaned.startsWith("+")
      ? "+" + cleaned.slice(1).replace(/\+/g, "")
      : cleaned.replace(/\+/g, "")
  ).slice(0, 24);
};

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Please enter your first name.")
      .max(50, "First name must not exceed 50 characters.")
      .regex(
        /^[\p{L}\s'-]+$/u,
        "Use letters, spaces, hyphens and apostrophes only.",
      ),
    lastName: z
      .string()
      .trim()
      .min(1, "Please enter your last name.")
      .max(50, "Last name must not exceed 50 characters.")
      .regex(
        /^[\p{L}\s'-]+$/u,
        "Use letters, spaces, hyphens and apostrophes only.",
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Please enter your email address.")
      .email("Please enter a valid email address.")
      .max(254, "Email address is too long."),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => {
          if (!value) return true;
          const digits = value.replace(/\D/g, "");
          return digits.length >= 10 && digits.length <= 15;
        },
        { message: "Enter a valid phone number using 10–15 digits." },
      ),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const inputClassName =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20";

  const invalidInputClassName =
    "border-red-400 focus:border-red-500 focus:ring-red-200";

  const onInvalid: SubmitErrorHandler<SignUpFormValues> = (formErrors) => {
    const firstError = Object.values(formErrors)[0]?.message;

    if (typeof firstError === "string") {
      toast.error(firstError);
    }
  };

  const onSubmit: SubmitHandler<SignUpFormValues> = async (values) => {
    try {
      const cleanFirstName = values.firstName.trim();
      const cleanLastName = values.lastName.trim();
      const cleanEmail = values.email.trim().toLowerCase();
      const cleanPhone = values.phone.trim();

      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: values.password,
        options: {
          emailRedirectTo: "https://pavilionofhismajesty.com/verify-email",
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
            phone: cleanPhone || null,
          },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message);
        return;
      }

      toast.success("Account created. Please check your email to verify it.");

      navigate("/verify-email", {
        replace: true,
        state: {
          email: cleanEmail,
        },
      });
    } catch (error) {
      console.error("Sign-up error:", error);
      toast.error(
        "Something went wrong while creating your account. Please try again.",
      );
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B45A]">
          Member Access
        </p>

        <h1 className="font-serif text-3xl font-semibold leading-tight text-[#07152F] sm:text-4xl">
          Create your account
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Create a Pavilion account to access member services and features.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-5"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium"
            >
              First name
            </label>

            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              maxLength={50}
              placeholder="First name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
              {...register("firstName", {
                onChange: (event) => {
                  const sanitized = sanitizeName(event.target.value);
                  if (sanitized !== event.target.value) {
                    setValue("firstName", sanitized, {
                      shouldValidate: true,
                    });
                  }
                },
              })}
              className={`${inputClassName} ${errors.firstName ? invalidInputClassName : ""}`}
            />

            {errors.firstName && (
              <p id="firstName-error" className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium"
            >
              Last name
            </label>

            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              maxLength={50}
              placeholder="Last name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              {...register("lastName", {
                onChange: (event) => {
                  const sanitized = sanitizeName(event.target.value);
                  if (sanitized !== event.target.value) {
                    setValue("lastName", sanitized, {
                      shouldValidate: true,
                    });
                  }
                },
              })}
              className={`${inputClassName} ${errors.lastName ? invalidInputClassName : ""}`}
            />

            {errors.lastName && (
              <p id="lastName-error" className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className={`${inputClassName} ${errors.email ? invalidInputClassName : ""}`}
          />

          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone number{" "}
            <span className="font-normal text-gray-500">(optional)</span>
          </label>

          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={24}
            placeholder="+234 703 802 1881"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone", {
              onChange: (event) => {
                const sanitized = sanitizePhone(event.target.value);
                if (sanitized !== event.target.value) {
                  setValue("phone", sanitized, {
                    shouldValidate: true,
                  });
                }
              },
            })}
            className={`${inputClassName} ${errors.phone ? invalidInputClassName : ""}`}
          />

          {errors.phone && (
            <p id="phone-error" className="mt-1 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              className={`${inputClassName} pr-12 ${errors.password ? invalidInputClassName : ""}`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              {...register("confirmPassword")}
              className={`${inputClassName} pr-12 ${errors.confirmPassword ? invalidInputClassName : ""}`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-[#07152F]/5 px-4 py-3 text-xs leading-5 text-gray-600">
          By creating an account, you agree to provide accurate information and
          use Pavilion member services responsibly.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="font-semibold text-[#07152F] underline decoration-[#D6B45A] decoration-2 underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
