import { type FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";

import { useAuth } from "../../components/layout/auth/AuthProvider";
import { supabase } from "../../lib/supabase";

function sanitizeName(value: string) {
  return value
    .replace(/[^\p{L}\s'-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 50);
}

function sanitizePhone(value: string) {
  const cleaned = value.replace(/[^\d+ ()-]/g, "");
  return (cleaned.startsWith("+") ? "+" + cleaned.slice(1).replace(/\+/g, "") : cleaned.replace(/\+/g, "")).slice(0, 24);
}

function countDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
    setPhone(profile.phone || "");
  }, [profile]);

  function handleFirstNameChange(value: string) {
    setFirstName(sanitizeName(value));
    setSuccess("");
    setError("");
  }

  function handleLastNameChange(value: string) {
    setLastName(sanitizeName(value));
    setSuccess("");
    setError("");
  }

  function handlePhoneChange(value: string) {
    setPhone(sanitizePhone(value));
    setSuccess("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanFirstName = firstName.trim().replace(/\s{2,}/g, " ");
    const cleanLastName = lastName.trim().replace(/\s{2,}/g, " ");
    const cleanPhone = phone.trim().replace(/\s{2,}/g, " ");

    if (!cleanFirstName) {
      setError("Please enter your first name.");
      return;
    }

    if (!/^[\p{L}\s'-]+$/u.test(cleanFirstName)) {
      setError(
        "First name can only contain letters, spaces, hyphens, and apostrophes.",
      );
      return;
    }

    if (!cleanLastName) {
      setError("Please enter your last name.");
      return;
    }

    if (!/^[\p{L}\s'-]+$/u.test(cleanLastName)) {
      setError(
        "Last name can only contain letters, spaces, hyphens, and apostrophes.",
      );
      return;
    }

    if (cleanPhone && countDigits(cleanPhone) < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (cleanPhone && countDigits(cleanPhone) > 15) {
      setError("Phone number cannot contain more than 15 digits.");
      return;
    }

    if (!user) {
      setError("Your session could not be found. Please sign in again.");
      return;
    }

    try {
      setLoading(true);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: cleanFirstName,
          last_name: cleanLastName,
          phone: cleanPhone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Profile update failed:", updateError);
        setError("We couldn't update your profile. Please try again.");
        return;
      }

      await refreshProfile();

      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating your profile.");
    } finally {
      setLoading(false);
    }
  }

  if (!profile || !user) {
    return (
      <section>
        <div className="flex min-h-75 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D6B45A] border-t-transparent" />

            <p className="text-sm text-[#07152F]/65">Loading your profile...</p>
          </div>
        </div>
      </section>
    );
  }

  const membershipLabel =
    profile.membership_status === "approved"
      ? "Approved"
      : profile.membership_status === "rejected"
        ? "Not approved"
        : "Pending review";

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D6B45A]">
          My Profile
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
          Profile
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
          Keep your Pavilion member information accurate and up to date.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm leading-6 text-green-700"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

          <span>{success}</span>
        </div>
      )}

      <div className="grid max-w-4xl gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-[#07152F]/10 bg-white p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-semibold text-[#07152F]">
              Personal information
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#07152F]/60">
              Update the information you want the church to have on your member
              profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-[#111827]"
                >
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    handleFirstNameChange(event.target.value)
                  }
                  autoComplete="given-name"
                  maxLength={50}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-[#111827]"
                >
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => handleLastNameChange(event.target.value)}
                  autoComplete="family-name"
                  maxLength={50}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[#111827]"
              >
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(event) => handlePhoneChange(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                maxLength={24}
                pattern="\+?[0-9 ()-]{7,24}"
                title="Use 10–15 digits, optionally with a leading +, spaces, brackets or hyphens."
                placeholder="+234 800 000 0000"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
              />

              <p className="mt-2 text-xs leading-5 text-[#07152F]/50">
                Include your country code if appropriate.
              </p>
            </div>

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
                value={user.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-[#07152F]/55"
              />

              <p className="mt-2 text-xs leading-5 text-[#07152F]/50">
                Your email address is managed through your account and cannot be
                changed here.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {loading ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        <aside className="h-fit rounded-2xl border border-[#07152F]/10 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D6B45A]">
            Membership
          </p>

          <h2 className="mt-3 text-lg font-semibold text-[#07152F]">
            Account status
          </h2>

          <div className="mt-5 rounded-xl bg-[#F8F6F1] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#07152F]/50">
              Membership
            </p>

            <p className="mt-1 font-semibold text-[#07152F]">
              {membershipLabel}
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#07152F]/60">
            Your membership status is managed by the church and cannot be
            changed from your account.
          </p>
        </aside>
      </div>
    </section>
  );
}
