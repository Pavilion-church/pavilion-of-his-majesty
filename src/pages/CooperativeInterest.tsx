import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";

import { supabase } from "../lib/supabase";

const nameSchema = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(80, "Name cannot exceed 80 characters.")
  .regex(
    /^[\p{L}][\p{L}\s'-]*$/u,
    "Use letters, spaces, hyphens or apostrophes.",
  );

const cooperativeInterestSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,

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
    .min(1, "Please enter your phone number.")
    .max(24, "Phone number is too long.")
    .refine(
      (value) =>
        /^\+?[0-9\s()-]+$/.test(value) &&
        (value.match(/\d/g) ?? []).length >= 7 &&
        (value.match(/\d/g) ?? []).length <= 15,
      "Enter a valid phone number with 7–15 digits.",
    ),

  message: z.string().max(1000, "Message cannot exceed 1,000 characters."),
});

type CooperativeInterestFormValues = z.infer<typeof cooperativeInterestSchema>;

export default function CooperativeInterest() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CooperativeInterestFormValues>({
    resolver: zodResolver(cooperativeInterestSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: CooperativeInterestFormValues) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        toast.error("Please sign in before submitting your interest.");
        return;
      }

      const { error: insertError } = await supabase
        .from("cooperative_interest")
        .insert({
          user_id: authData.user.id,
          first_name: values.firstName.trim().replace(/\s+/g, " "),
          last_name: values.lastName.trim().replace(/\s+/g, " "),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          message: values.message.trim() || null,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          toast.info(
            "You have already registered your interest in the cooperative.",
          );
          return;
        }

        console.error("Cooperative interest submission failed:", insertError);

        toast.error(
          "We couldn't submit your interest right now. Please try again.",
        );
        return;
      }

      reset();
      setSubmitted(true);
      toast.success("Your cooperative interest has been submitted.");
    } catch (err) {
      console.error("Cooperative interest submission failed:", err);

      toast.error(
        "Something went wrong. Please try submitting your interest again.",
      );
    }
  };

  const onInvalid = () => {
    toast.error("Please correct the highlighted fields before submitting.");
  };

  const inputClass = (hasError: boolean) =>
    `mt-2 w-full rounded-lg border bg-white px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#d6b45a]/20 ${
      hasError
        ? "border-red-400 focus:border-red-400"
        : "border-[#111827]/15 focus:border-[#d6b45a]"
    }`;

  const errorClass = "mt-1.5 text-xs leading-5 text-red-600";

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
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#07152f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102653]"
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
            className="inline-flex items-center gap-2 text-sm font-medium text-[#07152f] transition hover:text-[#a68f64]"
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
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
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
                type="text"
                autoComplete="given-name"
                maxLength={80}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
                {...register("firstName")}
                className={inputClass(Boolean(errors.firstName))}
              />

              {errors.firstName && (
                <p id="firstName-error" className={errorClass}>
                  {errors.firstName.message}
                </p>
              )}
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
                type="text"
                autoComplete="family-name"
                maxLength={80}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
                {...register("lastName")}
                className={inputClass(Boolean(errors.lastName))}
              />

              {errors.lastName && (
                <p id="lastName-error" className={errorClass}>
                  {errors.lastName.message}
                </p>
              )}
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
                type="email"
                autoComplete="email"
                maxLength={254}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                className={inputClass(Boolean(errors.email))}
              />

              {errors.email && (
                <p id="email-error" className={errorClass}>
                  {errors.email.message}
                </p>
              )}
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
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                maxLength={24}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...register("phone")}
                className={inputClass(Boolean(errors.phone))}
              />

              {errors.phone && (
                <p id="phone-error" className={errorClass}>
                  {errors.phone.message}
                </p>
              )}
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
              rows={5}
              maxLength={1000}
              placeholder="Is there anything you would like us to know?"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              {...register("message")}
              className={`${inputClass(Boolean(errors.message))} resize-none`}
            />

            {errors.message && (
              <p id="message-error" className={errorClass}>
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#07152f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102653] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Interest"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
