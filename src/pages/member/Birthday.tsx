import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Cake, CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";

import { useAuth } from "../../components/layout/auth/AuthProvider";
import { formatFileSize, prepareBirthdayPhoto } from "../../lib/imageUpload";
import { supabase } from "../../lib/supabase";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type BirthdaySubmission = {
  id: string;
  first_name: string;
  last_name: string;
  birthday_month: number;
  birthday_day: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

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

export default function Birthday() {
  const { profile, user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [phone, setPhone] = useState("");
  const [ministry, setMinistry] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [existingSubmission, setExistingSubmission] =
    useState<BirthdaySubmission | null>(null);

  const [checkingSubmission, setCheckingSubmission] = useState(true);

  const [success, setSuccess] = useState("");

  /*
   * Populate the birthday form with the member's existing
   * profile information.
   */
  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
    setPhone(profile.phone || "");
  }, [profile]);

  useEffect(() => {
    let active = true;

    async function loadBirthdaySubmission() {
      if (!user) {
        if (active) {
          setCheckingSubmission(false);
        }
        return;
      }

      setCheckingSubmission(true);

      const { data, error: fetchError } = await supabase
        .from("birthday_submissions")
        .select(
          "id, first_name, last_name, birthday_month, birthday_day, status, created_at",
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (fetchError) {
        console.error("Unable to load birthday submission:", fetchError);

        setError(
          "We couldn't check your birthday submission. Please refresh the page and try again.",
        );
      } else {
        setExistingSubmission(data as BirthdaySubmission | null);
      }

      setCheckingSubmission(false);
    }

    void loadBirthdaySubmission();

    return () => {
      active = false;
    };
  }, [user]);

  /*
   * Clean up the temporary preview URL when the page
   * unmounts or the preview changes.
   */
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const selectedMonth = Number(birthdayMonth);

  const daysInMonth = selectedMonth
    ? new Date(2024, selectedMonth, 0).getDate()
    : 31;

  const availableDays = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1,
  );

  function handleFirstNameChange(value: string) {
    setFirstName(sanitizeName(value));
    setError("");
  }

  function handleLastNameChange(value: string) {
    setLastName(sanitizeName(value));
    setError("");
  }

  function handlePhoneChange(value: string) {
    setPhone(sanitizePhone(value));
    setError("");
  }

  function handleMonthChange(value: string) {
    setBirthdayMonth(value);

    const numericMonth = Number(value);

    if (birthdayDay) {
      const currentDay = Number(birthdayDay);

      const maxDays = numericMonth
        ? new Date(2024, numericMonth, 0).getDate()
        : 31;

      if (currentDay > maxDays) {
        setBirthdayDay("");
      }
    }

    setError("");
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setPhotoLoading(true);

    try {
      const preparedPhoto = await prepareBirthdayPhoto(file);

      setPhoto(preparedPhoto);

      setPhotoPreview((currentPreview) => {
        if (currentPreview) {
          URL.revokeObjectURL(currentPreview);
        }

        return URL.createObjectURL(preparedPhoto);
      });
    } catch (err) {
      console.error(err);

      setPhoto(null);

      setPhotoPreview((currentPreview) => {
        if (currentPreview) {
          URL.revokeObjectURL(currentPreview);
        }

        return "";
      });

      setError(
        err instanceof Error ? err.message : "We couldn't prepare that image.",
      );
    } finally {
      setPhotoLoading(false);

      /*
       * Allows the member to select the same file again
       * after changing/removing it.
       */
      event.target.value = "";
    }
  }

  function removePhoto() {
    setPhoto(null);

    setPhotoPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return "";
    });

    setError("");
  }

 
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError("");
  setSuccess("");

  const cleanFirstName = firstName.trim().replace(/\s{2,}/g, " ");
  const cleanLastName = lastName.trim().replace(/\s{2,}/g, " ");
  const cleanPhone = phone.trim().replace(/\s{2,}/g, " ");
  const cleanMinistry = ministry.trim().replace(/\s{2,}/g, " ");

  const month = Number(birthdayMonth);
  const day = Number(birthdayDay);

  if (!user) {
    setError("Your session could not be found. Please sign in again.");
    return;
  }

  if (existingSubmission) {
    setError("You already have a birthday submission on your account.");
    return;
  }

  if (!cleanFirstName || !/^[\p{L}\s'-]+$/u.test(cleanFirstName)) {
    setError(
      "Enter a valid first name using letters, spaces, hyphens or apostrophes.",
    );
    return;
  }

  if (!cleanLastName || !/^[\p{L}\s'-]+$/u.test(cleanLastName)) {
    setError(
      "Enter a valid last name using letters, spaces, hyphens or apostrophes.",
    );
    return;
  }

  if (!month || month < 1 || month > 12) {
    setError("Please select your birth month.");
    return;
  }

  const maxDays = new Date(2024, month, 0).getDate();

  if (!day || day < 1 || day > maxDays) {
    setError("Please select a valid birthday.");
    return;
  }

  if (
    cleanPhone &&
    (countDigits(cleanPhone) < 10 || countDigits(cleanPhone) > 15)
  ) {
    setError("Please enter a valid phone number containing 10–15 digits.");
    return;
  }

  if (cleanMinistry.length > 100) {
    setError("Ministry name is too long.");
    return;
  }

  if (!photo || photo.size > 1024 * 1024) {
    setError("Please select a valid birthday photo no larger than 1 MB.");
    return;
  }

  if (!consent) {
    setError("Please confirm your consent before submitting your information.");
    return;
  }

  let uploadedPhotoPath: string | null = null;

  try {
    setLoading(true);

    // Recheck before uploading. The database unique index is the
    // final protection against simultaneous duplicate submissions.
    const { data: existing, error: checkError } = await supabase
      .from("birthday_submissions")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw new Error("We couldn't verify your existing birthday record.");
    }

    if (existing) {
      setExistingSubmission({
        id: existing.id,
        first_name: cleanFirstName,
        last_name: cleanLastName,
        birthday_month: month,
        birthday_day: day,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      setError("A birthday submission already exists for your account.");
      return;
    }

    // Store the path relative to the private birthday-photos bucket.
    uploadedPhotoPath = `${user.id}/birthday.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("birthday-photos")
      .upload(uploadedPhotoPath, photo, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Birthday photo upload failed:", uploadError);
      uploadedPhotoPath = null;
      throw new Error("We couldn't upload your photo. Please try again.");
    }

    const { data: insertedRecord, error: insertError } = await supabase
      .from("birthday_submissions")
      .insert({
        user_id: user.id,
        first_name: cleanFirstName,
        last_name: cleanLastName,
        birthday_month: month,
        birthday_day: day,
        phone: cleanPhone || null,
        email: user.email || null,
        ministry: cleanMinistry || null,
        photo_path: uploadedPhotoPath,
        consent,
      })
      .select(
        "id, first_name, last_name, birthday_month, birthday_day, status, created_at",
      )
      .single();

    if (insertError) {
      console.error("Birthday record insert failed:", insertError);
      throw new Error(
        "Your photo was uploaded, but we couldn't save your birthday information.",
      );
    }

    setExistingSubmission(insertedRecord as BirthdaySubmission);
    setSuccess(
      "Your birthday information has been submitted successfully. The church will review your submission.",
    );

    // Clear the form's temporary photo preview and selected file.
    setPhoto(null);
    setPhotoPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
      return "";
    });

    setConsent(false);
  } catch (err) {
    console.error("Birthday submission failed:", err);

    // Roll back the uploaded photo if the database insert failed.
    if (uploadedPhotoPath) {
      const { error: cleanupError } = await supabase.storage
        .from("birthday-photos")
        .remove([uploadedPhotoPath]);

      if (cleanupError) {
        console.error(
          "Photo cleanup failed; manual cleanup may be required:",
          cleanupError,
        );
      }
    }

    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong while submitting your birthday information.",
    );
  } finally {
    setLoading(false);
  }
}


  return (
    <section>
      <div className="mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D6B45A]/10">
          <Cake size={24} className="text-[#D6B45A]" />
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#D6B45A]">
          Birthday
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
          Birthday Information
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
          Share your birthday information with The Pavilion of His Majesty so we
          can celebrate and recognize your special day with you.
        </p>
      </div>

      <div className="max-w-3xl rounded-2xl border border-[#07152F]/10 bg-white p-6 sm:p-8">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        {checkingSubmission ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="animate-spin text-[#D6B45A]" size={24} />
            <span className="ml-3 text-sm text-[#07152F]/65">
              Checking your birthday information...
            </span>
          </div>
        ) : existingSubmission ? (
          <div className="rounded-2xl border border-[#07152F]/10 bg-[#F8F6F1] p-6">
            <CheckCircle2 className="text-[#D6B45A]" size={28} />

            <h2 className="mt-4 text-xl font-semibold text-[#07152F]">
              Birthday information on file
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#07152F]/65">
              {existingSubmission.status === "approved"
                ? "Your birthday information has been approved."
                : existingSubmission.status === "rejected"
                  ? "Your birthday submission needs attention. Please contact the church for guidance on updating it."
                  : "Your birthday information has been received and is awaiting church review."}
            </p>

            <p className="mt-4 text-sm font-medium text-[#07152F]">
              {months[existingSubmission.birthday_month - 1]}{" "}
              {existingSubmission.birthday_day}
            </p>
          </div>
        ) : (
          <>
            {success && (
              <div
                role="status"
                className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm leading-6 text-green-700"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal information */}

              <div>
                <h2 className="text-lg font-semibold text-[#07152F]">
                  Personal information
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#07152F]/55">
                  Confirm the information you would like the church to keep with
                  your birthday record.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="birthday-first-name"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    First name
                  </label>

                  <input
                    id="birthday-first-name"
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
                    htmlFor="birthday-last-name"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Last name
                  </label>

                  <input
                    id="birthday-last-name"
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      handleLastNameChange(event.target.value)
                    }
                    autoComplete="family-name"
                    maxLength={50}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  />
                </div>
              </div>

              {/* Birthday */}

              <div>
                <h2 className="text-lg font-semibold text-[#07152F]">
                  Your birthday
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#07152F]/55">
                  We only need the month and day. Your birth year is not
                  collected.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="birthday-month"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Month
                  </label>

                  <select
                    id="birthday-month"
                    value={birthdayMonth}
                    onChange={(event) => handleMonthChange(event.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  >
                    <option value="">Select month</option>

                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="birthday-day"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Day
                  </label>

                  <select
                    id="birthday-day"
                    value={birthdayDay}
                    onChange={(event) => {
                      setBirthdayDay(event.target.value);
                      setError("");
                    }}
                    disabled={!birthdayMonth}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  >
                    <option value="">Select day</option>

                    {availableDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact information */}

              <div>
                <h2 className="text-lg font-semibold text-[#07152F]">
                  Contact information
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="birthday-phone"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Phone number
                  </label>

                  <input
                    id="birthday-phone"
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
                </div>

                <div>
                  <label
                    htmlFor="birthday-email"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Email address
                  </label>

                  <input
                    id="birthday-email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-[#07152F]/55"
                  />
                </div>
              </div>

              {/* Ministry */}

              <div>
                <label
                  htmlFor="birthday-ministry"
                  className="mb-2 block text-sm font-medium text-[#111827]"
                >
                  Ministry{" "}
                  <span className="font-normal text-[#07152F]/45">
                    (optional)
                  </span>
                </label>

                <input
                  id="birthday-ministry"
                  type="text"
                  value={ministry}
                  onChange={(event) => {
                    setMinistry(event.target.value.slice(0, 100));
                    setError("");
                  }}
                  maxLength={100}
                  placeholder="e.g. Choir, Youth Ministry"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                />

                <p className="mt-2 text-xs leading-5 text-[#07152F]/50">
                  If you currently serve in a Pavilion ministry, you may
                  indicate it here.
                </p>
              </div>

              {/* Birthday photo */}

              <div>
                <div>
                  <h2 className="text-lg font-semibold text-[#07152F]">
                    Birthday photo
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#07152F]/55">
                    Upload a clear photo you'd like the church to use when
                    recognizing your birthday.
                  </p>
                </div>

                <div className="mt-4">
                  {photoPreview ? (
                    <div className="overflow-hidden rounded-2xl border border-[#07152F]/10 bg-[#F8F6F1]">
                      <div className="relative aspect-4/3 overflow-hidden bg-[#07152F]/5">
                        <img
                          src={photoPreview}
                          alt="Birthday photo preview"
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={removePhoto}
                          disabled={photoLoading || loading}
                          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#07152F]/85 text-white backdrop-blur transition hover:bg-[#07152F] disabled:opacity-50"
                          aria-label="Remove birthday photo"
                        >
                          <X size={17} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#07152F]">
                            {photo?.name}
                          </p>

                          <p className="mt-1 text-xs text-[#07152F]/55">
                            Optimized size:{" "}
                            {photo ? formatFileSize(photo.size) : ""}
                          </p>
                        </div>

                        <label className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#07152F]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#07152F] transition hover:border-[#D6B45A]/60 hover:bg-[#D6B45A]/5">
                          Change photo
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            disabled={photoLoading || loading}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="group block cursor-pointer rounded-2xl border border-dashed border-[#07152F]/20 bg-[#F8F6F1] p-8 text-center transition hover:border-[#D6B45A]/60 hover:bg-[#D6B45A]/5">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                        {photoLoading ? (
                          <Loader2
                            size={24}
                            className="animate-spin text-[#D6B45A]"
                          />
                        ) : (
                          <ImagePlus size={24} className="text-[#D6B45A]" />
                        )}
                      </div>

                      <p className="mt-4 text-sm font-semibold text-[#07152F]">
                        {photoLoading
                          ? "Optimizing your photo..."
                          : "Choose a birthday photo"}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#07152F]/55">
                        JPG, PNG or WebP · Maximum 1 MB after optimization
                      </p>

                      <span className="mt-5 inline-flex rounded-xl bg-[#07152F] px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#0d234d]">
                        Select photo
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        disabled={photoLoading || loading}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#07152F]/50">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" />

                  <p>
                    Your photo is optimized in your browser before it is
                    uploaded. It is stored privately and is not published on the
                    website.
                  </p>
                </div>
              </div>

              {/* Consent */}

              <div className="rounded-2xl border border-[#07152F]/10 bg-[#F8F6F1] p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setError("");
                    }}
                    className="mt-1 h-4 w-4 accent-[#07152F]"
                  />

                  <span className="text-sm leading-6 text-[#07152F]/70">
                    I consent to The Pavilion of His Majesty storing and using
                    my birthday information and submitted photo for church
                    birthday recognition and related member communications.
                  </span>
                </label>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading || photoLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}

                {loading
                  ? "Preparing submission..."
                  : "Submit birthday information"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
