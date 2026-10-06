import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CooperativeInterest() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Connect this to the cooperative submission service later.
    setSubmitted(true);
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
            The church will review your submission and provide further
            information about the next steps.
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
            Please provide your basic details below. A member of the cooperative
            team will contact you with further information.
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
              placeholder="Is there anything you would like us to know?"
              className="mt-2 w-full resize-none rounded-lg border border-[#111827]/15 bg-white px-4 py-3 outline-none transition focus:border-[#d6b45a]"
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-[#07152f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102653]"
          >
            Submit Interest
          </button>
        </form>
      </div>
    </section>
  );
}
