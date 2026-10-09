import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

type SignInLocationState = {
  from?: string;
};

type AccountRole = "member" | "admin" | "super_admin";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (signInError) {
        setError("Incorrect email or password.");
        return;
      }

      if (!data.user) {
        setError("We couldn't complete your sign in. Please try again.");
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

        setError(
          "We signed you in but couldn't verify your account permissions. Please try again, and contact the church administrator if the problem continues.",
        );
        return;
      }

      const role = profile.role as AccountRole;

      if (!["member", "admin", "super_admin"].includes(role)) {
        await supabase.auth.signOut();

        setError(
          "Your account has an unrecognized role. Please contact the church administrator.",
        );
        return;
      }

      const destination = getSafeDestination(state?.from, role);
      navigate(destination, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while signing you in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            maxLength={254}
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
          />
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
              placeholder="Enter your password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Signing in..." : "Sign in"}
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
