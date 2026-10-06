import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";
import { cooperativeInfo } from "../assets/data";

export default function Cooperative() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#07152f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d6b45a]">
              Church Cooperative
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Growing Together.
              <span className="block text-[#e2bd61]">Building Together.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              {cooperativeInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-[#f8f6f1]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a68f64]">
              About the Cooperative
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#07152f] sm:text-4xl">
              Supporting one another through collective growth.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-[#4b5563]">
            <p>
              The Pavilion Cooperative provides an avenue for interested members
              of the church to participate in a structured cooperative
              initiative built around saving, mutual support and shared
              opportunities.
            </p>

            <p>
              If you are interested in becoming part of the cooperative, submit
              your details and the appropriate church representatives will
              provide further information about membership, requirements and
              participation.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a68f64]">
              Why Join
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#07152f] sm:text-4xl">
              What the cooperative is about
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {cooperativeInfo.benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-2xl border border-[#07152f]/10 bg-[#f8f6f1] p-7"
              >
                <CheckCircle2 size={24} className="text-[#d6b45a]" />

                <p className="mt-5 text-base font-medium leading-7 text-[#111827]">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#07152f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d6b45a]/40 bg-[#d6b45a]/10">
                <Users className="text-[#e2bd61]" size={26} />
              </div>

              <h2 className="mt-6 font-serif text-3xl font-semibold sm:text-4xl">
                Interested in becoming a member?
              </h2>

              <p className="mt-5 leading-8 text-white/65">
                Submit a short expression of interest. The cooperative team will
                review your submission and provide the next steps.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/4 p-8 sm:p-10">
              <p className="text-sm leading-7 text-white/65">
                Membership requirements, contribution arrangements and other
                cooperative terms will be communicated by the church to
                interested and eligible members.
              </p>

              <Link
                to="/cooperative/interest"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d6b45a] px-6 py-3 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
              >
                Express Your Interest
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f8f6f1]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a68f64]">
            Questions?
          </p>

          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#07152f]">
            We are happy to help.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#4b5563]">
            For questions about the cooperative, membership or participation,
            please contact the church.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#07152f] px-6 py-3 text-sm font-semibold text-[#07152f] transition hover:bg-[#07152f] hover:text-white"
          >
            Contact the Church
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
