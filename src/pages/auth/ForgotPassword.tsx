import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (resetError) {
        setError(
          "We couldn't process that request right now. Please try again.",
        );
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);

      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

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

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}

              {loading ? "Sending..." : "Send reset link"}
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
