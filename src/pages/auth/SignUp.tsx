import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

const sanitizeName = (value: string) =>
  value.replace(/[^\p{L}\s'-]/gu, "").replace(/\s{2,}/g, " ").slice(0, 50);

const sanitizePhone = (value: string) => {
  const cleaned = value.replace(/[^\d+ ()-]/g, "");
  return (cleaned.startsWith("+") ? "+" + cleaned.slice(1).replace(/\+/g, "") : cleaned.replace(/\+/g, "")).slice(0, 24);
};

const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

export default function SignUp() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanFirstName || !cleanLastName) {
      setError("Please enter your first and last name.");
      return;
    }

    if (
      !/^[\p{L}\s'-]+$/u.test(cleanFirstName) ||
      !/^[\p{L}\s'-]+$/u.test(cleanLastName)
    ) {
      setError(
        "Names can only contain letters, spaces, hyphens and apostrophes.",
      );
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (cleanPhone && !isValidPhone(cleanPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
            phone: cleanPhone || null,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      navigate("/verify-email", {
        replace: true,
        state: {
          email: cleanEmail,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while creating your account. Please try again.",
      );
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
          Create your account
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Create a Pavilion account to access member services and features.
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
              value={firstName}
              onChange={(e) => setFirstName(sanitizeName(e.target.value))}
              autoComplete="given-name"
              maxLength={50}
              required
              placeholder="First name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
            />
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
              value={lastName}
              onChange={(e) => setLastName(sanitizeName(e.target.value))}
              autoComplete="family-name"
              maxLength={50}
              required
              placeholder="Last name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={254}
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone number{" "}
            <span className="font-normal text-gray-500">(optional)</span>
          </label>

          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(sanitizePhone(e.target.value))}
            autoComplete="tel"
            inputMode="tel"
            maxLength={24}
            pattern="\+?[0-9 ()-]{7,24}"
            title="Use 10–15 digits, optionally with a leading +, spaces, brackets or hyphens."
            placeholder="+234 703 802 1881"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Repeat your password"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
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
        </div>

        <div className="rounded-xl bg-[#07152F]/5 px-4 py-3 text-xs leading-5 text-gray-600">
          By creating an account, you agree to provide accurate information and
          use Pavilion member services responsibly.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
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
