import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { supabase } from "../../lib/supabase";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password cannot exceed 128 characters."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data, error: sessionCheckError } =
        await supabase.auth.getSession();

      if (!mounted) return;

      if (data.session) {
        setReady(true);
        setSessionError("");
      } else if (sessionCheckError || !data.session) {
        setSessionError(
          "This password reset link is invalid or has expired. Please request a new one.",
        );
      }
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setSessionError("");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!ready) {
      toast.error(
        "Your password reset session is unavailable. Please request a new link.",
      );
      return;
    }

    setSessionError("");

    try {
      setLoading(true);

      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (updateError) {
        toast.error(
          "We couldn't update your password. Please request a new reset link and try again.",
        );
        return;
      }

      setSuccess(true);
      toast.success("Your password has been updated successfully.");

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("Sign-out after password reset failed:", signOutError);
      }
    } catch (err) {
      console.error("Password reset failed:", err);
      toast.error("Something went wrong while updating your password.");
    } finally {
      setLoading(false);
    }
  }

  function onInvalid() {
    toast.error("Please correct the highlighted fields.");
  }

  if (success) {
    return (
      <div>
        <div className="mb-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <LockKeyhole size={26} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B45A]">
            Password Updated
          </p>

          <h1 className="font-serif text-3xl font-semibold leading-tight text-[#07152F] sm:text-4xl">
            You're all set
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Your Pavilion account password has been successfully updated.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/sign-in", { replace: true })}
          className="w-full rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d]"
        >
          Sign in with your new password
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D6B45A]/15 text-[#07152F]">
          <LockKeyhole size={26} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B45A]">
          Account Recovery
        </p>

        <h1 className="font-serif text-3xl font-semibold leading-tight text-[#07152F] sm:text-4xl">
          Create a new password
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Choose a new password for your Pavilion account.
        </p>
      </div>

      {sessionError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {sessionError}
        </div>
      )}

      {ready && (
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#111827]"
            >
              New password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
                className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-[#D6B45A]/20 ${
                  errors.password
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 focus:border-[#D6B45A]"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition hover:text-[#07152F]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                className="mt-1.5 text-xs text-red-600"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#111827]"
            >
              Confirm new password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
                {...register("confirmPassword")}
                className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-[#D6B45A]/20 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 focus:border-[#D6B45A]"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition hover:text-[#07152F]"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
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
              <p
                id="confirm-password-error"
                className="mt-1.5 text-xs text-red-600"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-[#07152F]/5 px-4 py-3 text-xs leading-5 text-gray-600">
            Use at least 8 characters. For better security, use a combination
            of letters, numbers and symbols.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Updating password..." : "Update password"}
          </button>
        </form>
      )}

      {!ready && (
        <Link
          to="/forgot-password"
          className="flex w-full items-center justify-center rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d]"
        >
          Request a new reset link
        </Link>
      )}
    </div>
  );
}
