import {
  ArrowRight,
  Heart,
  HandHeart,
  Users,
  Church,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import worshipImage from "../assets/images/worship-service.jpeg";

const involvementOptions = [
  {
    icon: Users,
    title: "Connect",
    description:
      "Build meaningful relationships and become part of a welcoming church family.",
    link: "/contact",
    linkText: "Connect with us",
  },
  {
    icon: HandHeart,
    title: "Serve",
    description:
      "Use your gifts, time and abilities to support the work of God and bless others.",
    link: "/ministries",
    linkText: "Explore ministries",
  },
  {
    icon: Church,
    title: "Worship With Us",
    description:
      "Join us in worship, fellowship and the Word as we grow together in Christ.",
    link: "/plan-your-visit",
    linkText: "Plan your visit",
  },
];

export default function GetInvolved() {
  return (
    <div className="bg-[#f8f6f1] text-[#111827]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07152f] text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-40 -top-40 h-125 w-125 rounded-full bg-[#d6b45a]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-[#d6b45a]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-[#e2bd61]">
              <span className="h-px w-10 bg-[#d6b45a]" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                Get Involved
              </span>
            </div>

            <h1 className="font-serif text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              There is a place
              <span className="block text-[#e2bd61]">for you here.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Church is more than attending a service. It is a community where
              we worship, grow, serve and walk through life together.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-[#b18a32]">
                <Heart size={18} />

                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Life Together
                </span>
              </div>

              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-[#07152f] sm:text-5xl">
                Find your place in the family.
              </h2>
            </div>

            <div className="max-w-2xl lg:ml-auto">
              <p className="text-base leading-8 text-gray-600 sm:text-lg">
                Whether you are visiting for the first time, looking for a
                church family or ready to serve, there are many ways to become
                part of what God is doing at The Pavilion of His Majesty.
              </p>

              <p className="mt-5 text-base leading-8 text-gray-600">
                Start where you are. Connect with people, discover a ministry
                that interests you and take your next step at your own pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INVOLVEMENT OPTIONS */}
      <section className="bg-[#f8f6f1]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b18a32]">
              Your Next Step
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#07152f] sm:text-5xl">
              Start somewhere meaningful.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {involvementOptions.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className="group bg-white p-8 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f] text-[#e2bd61] transition group-hover:bg-[#d6b45a] group-hover:text-[#07152f]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-7 font-serif text-2xl font-semibold text-[#07152f]">
                    {option.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-gray-600">
                    {option.description}
                  </p>

                  <Link
                    to={option.link}
                    className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#9a7528] transition group-hover:text-[#07152f]"
                  >
                    {option.linkText}
                    <ArrowRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVE SECTION */}
      <section className="overflow-hidden bg-[#07152f] text-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative min-h-105 overflow-hidden">
            <img
              src={worshipImage}
              alt="Worship service at The Pavilion of His Majesty"
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />

            <div className="absolute inset-0 bg-linear-to-t from-[#07152f] via-[#07152f]/20 to-transparent" />

            <div className="absolute bottom-8 left-6 sm:left-10">
              <span className="border border-white/20 bg-[#07152f]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e2bd61] backdrop-blur-sm">
                Serve With Purpose
              </span>
            </div>
          </div>

          <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-[#d6b45a]">
                <Sparkles size={18} />

                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Serve
                </span>
              </div>

              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Your gift can make a difference.
              </h2>

              <p className="mt-6 text-sm leading-8 text-white/65 sm:text-base">
                From welcoming people at the door to worship, evangelism,
                welfare, sanitation and media, our ministries provide
                opportunities to contribute to the life of the church.
              </p>

              <Link
                to="/ministries"
                className="mt-8 inline-flex items-center gap-3 bg-[#d6b45a] px-7 py-4 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
              >
                Explore Our Ministries
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE STEPS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b18a32]">
              Take Your Next Step
            </p>

            <h2 className="mt-4 font-serif text-4xl font-semibold text-[#07152f] sm:text-5xl">
              Getting involved can be simple.
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
              You do not have to figure everything out at once. Start with one
              simple step and let your journey grow from there.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f] font-serif text-lg text-[#e2bd61]">
                01
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold text-[#07152f]">
                Come Worship
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Join us for one of our weekly gatherings and experience the
                church family.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f] font-serif text-lg text-[#e2bd61]">
                02
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold text-[#07152f]">
                Connect
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Get to know the church, meet people and discover where you fit
                within the community.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07152f] font-serif text-lg text-[#e2bd61]">
                03
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold text-[#07152f]">
                Serve
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Explore a ministry and find an opportunity to use your gifts in
                service to God and others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-[#f8f6f1]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden bg-[#07152f] px-6 py-14 text-center text-white sm:px-10 lg:px-16 lg:py-20">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d6b45a]/10 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b45a]">
                We&apos;d Love to Hear From You
              </p>

              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Not sure where to start?
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
                Reach out to us and we will be glad to help you find the right
                next step.
              </p>

              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 bg-[#d6b45a] px-7 py-4 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
              >
                Contact Us
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
