import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";

import { churchInfo } from "../assets/data";
import { supabase } from "../lib/supabase";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name cannot exceed 100 characters.")
    .regex(
      /^[\p{L}][\p{L}\s'-]*$/u,
      "Use letters, spaces, hyphens or apostrophes.",
    ),

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
    .refine(
      (value) =>
        value === "" ||
        (/^\+?[0-9\s()-]+$/.test(value) &&
          (value.match(/\d/g) ?? []).length >= 7 &&
          (value.match(/\d/g) ?? []).length <= 15),
      "Enter a valid phone number with 7–15 digits.",
    ),

  subject: z
    .string()
    .trim()
    .min(1, "Please enter a subject.")
    .max(180, "Subject cannot exceed 180 characters."),

  message: z
    .string()
    .trim()
    .min(1, "Please enter your message.")
    .max(5000, "Message cannot exceed 5,000 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const { error: insertError } = await supabase
        .from("contact_submissions")
        .insert({
          name: values.name.trim().replace(/\s+/g, " "),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim() || null,
          subject: values.subject.trim(),
          message: values.message.trim(),
        });

      if (insertError) {
        console.error("Contact form submission failed:", insertError);
        toast.error(
          "We couldn't send your message right now. Please try again or contact us directly by email.",
        );
        return;
      }

      reset();
      setSubmitted(true);
      toast.success("Your message has been sent successfully.");
    } catch (submissionError) {
      console.error("Contact form submission failed:", submissionError);
      toast.error(
        "Something went wrong. Please try again or contact us directly by email.",
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

  
  useEffect(() => {
    const title = "Contact Us | The Pavilion of His Majesty, RCCG Oyo";
    const description =
      "Contact The Pavilion of His Majesty, RCCG, Akinmoorin, Oyo, Oyo State. Find our church address, phone number and email, get directions, or send us a message.";

    document.title = title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`,
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    const setProperty = (property: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    const canonicalUrl = `${window.location.origin}/contact`;

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    setProperty("og:type", "website");
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:url", canonicalUrl);
    setProperty("og:site_name", "The Pavilion of His Majesty");
  }, []);


  return (
    <div>
      {/* Hero */}
      <section className="bg-[#07152f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d6b45a]">
              Contact Us
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              We would love to
              <span className="text-[#e2bd61]"> hear from you.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Whether you have a question, need more information or simply want
              to connect with us, we are happy to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact information */}
      <section className="bg-[#f8f6f1]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Email */}
            <a
              href={`mailto:${churchInfo.contact.email}`}
              className="group rounded-2xl border border-[#07152f]/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f]">
                <Mail size={20} className="text-[#e2bd61]" />
              </div>

              <h2 className="mt-6 font-serif text-2xl font-semibold text-[#07152f]">
                Email Us
              </h2>

              <p className="mt-3 break-all text-sm leading-7 text-[#4b5563] group-hover:text-[#07152f]">
                {churchInfo.contact.email}
              </p>
            </a>

            {/* Phone */}
            <a
              href={`tel:${churchInfo.contact.pastorPhone.replace(/\s/g, "")}`}
              className="group rounded-2xl border border-[#07152f]/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f]">
                <Phone size={20} className="text-[#e2bd61]" />
              </div>

              <h2 className="mt-6 font-serif text-2xl font-semibold text-[#07152f]">
                Call Us
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#4b5563] group-hover:text-[#07152f]">
                {churchInfo.contact.pastorPhone}
              </p>
            </a>

            {/* Address */}
            <div className="rounded-2xl border border-[#07152f]/10 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f]">
                <MapPin size={20} className="text-[#e2bd61]" />
              </div>

              <h2 className="mt-6 font-serif text-2xl font-semibold text-[#07152f]">
                Visit Us
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                {churchInfo.address.full}
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Lane+4+Oko+Oba%2C+Alapini+Street%2C+Akinmoorin%2C+Oyo%2C+Oyo+State%2C+Nigeria"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[#07152f] transition hover:text-[#a68f64]"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form + message */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a68f64]">
              Send a Message
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#07152f] sm:text-4xl">
              Have a question?
            </h2>

            <p className="mt-5 max-w-md leading-8 text-[#4b5563]">
              Send us a message and someone from the church will get back to
              you.
            </p>

            <div className="mt-10 border-l-2 border-[#d6b45a] pl-5">
              <p className="text-sm leading-7 text-[#6b7280]">
                You can also reach us directly through the phone number or email
                above.
              </p>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="rounded-2xl border border-[#07152f]/10 bg-[#f8f6f1] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f]">
                  <Send size={20} className="text-[#e2bd61]" />
                </div>

                <h3 className="mt-6 font-serif text-2xl font-semibold text-[#07152f]">
                  Message received.
                </h3>

                <p className="mt-3 leading-7 text-[#4b5563]">
                  Thank you for contacting The Pavilion of His Majesty. We will
                  get back to you as soon as possible.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-[#07152f] underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                noValidate
                className="rounded-2xl border border-[#07152f]/10 bg-[#f8f6f1] p-6 sm:p-8"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-[#111827]"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      {...register("name")}
                      className={inputClass(Boolean(errors.name))}
                    />

                    {errors.name && (
                      <p id="name-error" className={errorClass}>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-[#111827]"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      {...register("email")}
                      className={inputClass(Boolean(errors.email))}
                    />

                    {errors.email && (
                      <p id="email-error" className={errorClass}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-[#111827]"
                  >
                    Phone Number{" "}
                    <span className="text-gray-500">(optional)</span>
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

                <div className="mt-6">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-[#111827]"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    maxLength={180}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                      errors.subject ? "subject-error" : undefined
                    }
                    {...register("subject")}
                    className={inputClass(Boolean(errors.subject))}
                  />

                  {errors.subject && (
                    <p id="subject-error" className={errorClass}>
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-[#111827]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows={6}
                    maxLength={5000}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
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
                      <Loader2 size={17} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={17} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-[#07152f]">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            We look forward to welcoming you.
          </h2>

          <p className="mt-5 leading-8 text-white/65">
            Come worship with us, connect with the church family and be part of
            what God is doing at The Pavilion of His Majesty.
          </p>
        </div>
      </section>
    </div>
  );
}
