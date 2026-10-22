import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const onInvalid: SubmitErrorHandler<ForgotPasswordFormValues> = (
    formErrors,
  ) => {
    const firstError = Object.values(formErrors)[0]?.message;

    if (typeof firstError === "string") {
      toast.error(firstError);
    }
  };

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (values) => {
    setSuccess(false);

    try {
      const cleanEmail = values.email.trim().toLowerCase();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (resetError) {
        console.error("Password reset request failed:", resetError);
        toast.error(
          "We couldn't process that request right now. Please try again.",
        );
        return;
      }

      setSuccess(true);
      toast.success(
        "If an account exists for that email, a reset link will be sent.",
      );
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Something went wrong. Please try again in a moment.");
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20";

  return (
    <div>
      <div className="mb-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D6B45A]/15 text-[#07152F]">
          <Mail size={26} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B45A]">
          Account Recovery
        </p>

        <h1 className="font-serif text-3xl font-semibold leading-tight text-[#07152F] sm:text-4xl">
          Forgot your password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Enter the email address connected to your Pavilion account and we'll
          send you a password reset link.
        </p>
      </div>

      {success ? (
        <div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <h2 className="font-semibold text-green-900">Check your email</h2>

            <p className="mt-2 text-sm leading-6 text-green-800">
              If an account exists for that email address, you'll receive
              instructions to reset your password.
            </p>

            <p className="mt-3 text-xs leading-5 text-green-700">
              Check your spam or junk folder if you don't see the email shortly.
            </p>
          </div>

          <Link
            to="/sign-in"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d]"
          >
            <ArrowLeft size={17} />
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-5"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#111827]"
              >
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
                className={`${inputClassName} ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : ""
                }`}
              />

              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/sign-in"
              className="font-semibold text-[#07152F] underline decoration-[#D6B45A] decoration-2 underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
