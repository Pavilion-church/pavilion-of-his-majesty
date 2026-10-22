import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

type SignInLocationState = {
  from?: string;
};

type AccountRole = "member" | "admin" | "super_admin";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  password: z.string().min(1, "Please enter your password."),
});

type SignInFormValues = z.infer<typeof signInSchema>;

function getSafeDestination(from: string | undefined, role: AccountRole) {
  const isAdmin = role === "admin" || role === "super_admin";

  // Accept internal app paths only.
  const safeFrom =
    from?.startsWith("/") && !from.startsWith("//") ? from : null;

  if (!safeFrom) {
    return isAdmin ? "/admin" : "/member";
  }

  // A regular member must not be redirected to an admin route.
  if (!isAdmin && (safeFrom === "/admin" || safeFrom.startsWith("/admin/"))) {
    return "/member";
  }

  return safeFrom;
}

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as SignInLocationState | null;

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const inputClassName =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20";

  const invalidInputClassName =
    "border-red-400 focus:border-red-500 focus:ring-red-200";

  const onInvalid: SubmitErrorHandler<SignInFormValues> = (formErrors) => {
    const firstError = Object.values(formErrors)[0]?.message;

    if (typeof firstError === "string") {
      toast.error(firstError);
    }
  };

  const onSubmit: SubmitHandler<SignInFormValues> = async (values) => {
    try {
      const cleanEmail = values.email.trim().toLowerCase();

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: values.password,
        });

      if (signInError) {
        // Keep this generic to avoid revealing whether an email is registered.
        toast.error("Incorrect email or password.");
        return;
      }

      if (!data.user) {
        toast.error("We couldn't complete your sign in. Please try again.");
        return;
      }

      // Load the role from the signed-in user's own profile.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile?.role) {
        console.error(
          "Unable to load the signed-in user's role:",
          profileError,
        );

        await supabase.auth.signOut();

        toast.error(
          "We couldn't verify your account permissions. Please try again or contact the church administrator.",
        );
        return;
      }

      const role = profile.role as AccountRole;

      if (!["member", "admin", "super_admin"].includes(role)) {
        await supabase.auth.signOut();

        toast.error(
          "Your account has an unrecognized role. Please contact the church administrator.",
        );
        return;
      }

      const destination = getSafeDestination(state?.from, role);

      toast.success("Signed in successfully.");

      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error(
        "Something went wrong while signing you in. Please try again.",
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
          Welcome back
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Sign in to your Pavilion account.
        </p>
      </div>

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
            className={`${inputClassName} ${errors.email ? invalidInputClassName : ""}`}
          />

          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#111827]"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#07152F] underline decoration-[#D6B45A] underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              className={`${inputClassName} pr-12 ${errors.password ? invalidInputClassName : ""}`}
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
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          className="font-semibold text-[#07152F] underline decoration-[#D6B45A] decoration-2 underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
