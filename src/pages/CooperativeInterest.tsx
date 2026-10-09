import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function CooperativeInterest() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const namePattern = /^[\p{L}][\p{L}\s'-]*$/u;
    const phonePattern = /^\+?[\d\s()-]{7,20}$/;

    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      setError("Please enter valid names using letters, spaces, hyphens or apostrophes.");
      return;
    }

    if (!phonePattern.test(phone) || phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        setError("Please sign in before submitting your interest.");
        return;
      }

      const { error: insertError } = await supabase
        .from("cooperative_interest")
        .insert({
          user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          message: message || null,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError(
            "You have already registered your interest in the cooperative.",
          );
          return;
        }

        throw insertError;
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error("Cooperative interest submission failed:", err);
      setError("We couldn't submit your interest right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[70vh] bg-[#f8f6f1]">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#07152f]">
            <CheckCircle2 className="text-[#e2bd61]" size={30} />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-semibold text-[#07152f] sm:text-4xl">
            Interest Submitted
          </h1>

          <p className="mt-5 leading-8 text-[#4b5563]">
            Thank you for expressing your interest in the Pavilion Cooperative.
            The church will review your submission and communicate the next
            steps.
          </p>

          <Link
            to="/cooperative"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#07152f] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Back to Cooperative
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f8f6f1]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-10">
          <Link
            to="/cooperative"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#07152f] hover:text-[#a68f64]"
          >
            <ArrowLeft size={16} />
            Back to Cooperative
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#a68f64]">
            Expression of Interest
          </p>

          <h1 className="mt-4 font-serif text-4xl font-semibold text-[#07152f]">
            Join the Pavilion Cooperative
          </h1>

          <p className="mt-4 leading-8 text-[#4b5563]">
            Please provide your details below. A member of the cooperative team
            will contact you with further information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#07152f]/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-[#111827]"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                maxLength={80}
                pattern="[\p{L}][\p{L}\s'-]*"
                title="Use letters, spaces, apostrophes or hyphens."
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/[^\p{L}\s'-]/gu, "")
                    .slice(0, 80);
                }}
                autoComplete="given-name"
                className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-[#111827]"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                maxLength={80}
                pattern="[\p{L}][\p{L}\s'-]*"
                title="Use letters, spaces, apostrophes or hyphens."
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/[^\p{L}\s'-]/gu, "")
                    .slice(0, 80);
                }}
                autoComplete="family-name"
                className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#111827]"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-[#111827]"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={24}
                autoComplete="tel"
                inputMode="tel"
                pattern="\+?[0-9 ()-]{7,24}"
                title="Enter a valid phone number using 7–15 digits."
                onChange={(event) => {
                  const input = event.currentTarget;
                  const cleaned = input.value.replace(/[^0-9+ ()-]/g, "");
                  input.value = (
                    cleaned.startsWith("+")
                      ? "+" + cleaned.slice(1).replace(/\+/g, "")
                      : cleaned.replace(/\+/g, "")
                  ).slice(0, 24);
                }}
                className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="message"
              className="text-sm font-medium text-[#111827]"
            >
              Message <span className="text-[#6b7280]">(Optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              maxLength={1000}
              placeholder="Is there anything you would like us to know?"
              className="mt-2 w-full resize-none rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#07152f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102653] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <LoaderCircle size={18} className="animate-spin" />}
            {submitting ? "Submitting..." : "Submit Interest"}
          </button>
        </form>
      </div>
    </section>
  );
}
