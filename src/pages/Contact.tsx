import { type FormEvent, useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { churchInfo } from "../assets/data";
import { supabase } from "../lib/supabase";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const phone = String(formData.get("phone") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const namePattern = /^[\p{L}][\p{L}\s'-]*$/u;
    const phoneDigits = phone.replace(/\D/g, "");

    if (!namePattern.test(name) || name.length > 100) {
      setError("Please enter a valid name using letters, spaces, hyphens or apostrophes.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      setError("Please enter a valid email address.");
      return;
    }
    if (phone && (!/^\+?[\d\s()-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15)) {
      setError("Please enter a valid phone number (7–15 digits).");
      return;
    }
    if (!subject || subject.length > 180 || !message || message.length > 5000) {
      setError("Please provide a subject and message within the allowed length.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("contact_submissions").insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
      });
      if (insertError) throw insertError;
      form.reset();
      setSubmitted(true);
    } catch (submissionError) {
      console.error("Contact form submission failed:", submissionError);
      setError("We couldn't send your message right now. Please try again or contact us directly by email.");
    } finally {
      setSubmitting(false);
    }
  };

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
                onSubmit={handleSubmit}
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
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      pattern="[\p{L}][\p{L}\s'-]*"
                      title="Use letters, spaces, hyphens or apostrophes."
                      onChange={(event) => {
                        event.currentTarget.value = event.currentTarget.value.replace(/[^\p{L}\s'-]/gu, "");
                      }}
                      required
                      className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
                    />
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
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      required
                      className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
                    />
                  </div>
                </div>

                <div className="mt-6">
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
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={24}
                    pattern="\+?[0-9 ()-]{7,24}"
                    title="Use 7–15 digits, optionally with a leading +, spaces, brackets or hyphens."
                    onChange={(event) => {
                      const input = event.currentTarget;
                      const cleaned = input.value.replace(/[^0-9+ ()-]/g, "");
                      input.value = cleaned.startsWith("+") ? "+" + cleaned.slice(1).replace(/\+/g, "") : cleaned.replace(/\+/g, "");
                    }}
                    className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
                  />
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
                    name="subject"
                    type="text"
                    required
                    className="mt-2 w-full rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
                  />
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
                    name="message"
                    rows={6}
                    maxLength={5000}
                    required
                    className="mt-2 w-full resize-none rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#07152f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102653] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Message"}
                  <Send size={17} />
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
