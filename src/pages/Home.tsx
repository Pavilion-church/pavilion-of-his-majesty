import {
  ArrowRight,
  CalendarDays,
  Clock3,
  HeartHandshake,
  MapPin,
  Play,
} from "lucide-react";

import churchBuilding from "../assets/images/church-building.png";
import choirImage from "../assets/images/choir.jpeg";
import worshipImage from "../assets/images/worship-service.jpeg";
import youthImage from "../assets/images/youth-ministry.jpeg";
import evangelismImage from "../assets/images/evangelism.jpeg";


import { churchInfo, weeklyProgrammes } from "../assets/data";

const ministryImages: Record<string, string> = {
  "Youth Ministry": youthImage,
  Choir: choirImage,
  Evangelism: evangelismImage,
};

const featuredMinistries = [
  {
    name: "Youth Ministry",
    description:
      "A Christ-centred community where young people grow in faith, purpose and service.",
  },
  {
    name: "Choir",
    description:
      "Leading the church into worship and praise through music and ministry.",
  },
  {
    name: "Evangelism",
    description:
      "Taking the message of Christ beyond the walls of the church and into our community.",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#07152f]">
        {/* Background image */}
        <img
          src={churchBuilding}
          alt="The Pavilion of His Majesty church building"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-[#07152f]/55" />
        <div className="absolute inset-0 bg-linear-to-r from-[#07152f]/95 via-[#07152f]/65 to-[#07152f]/20" />
        <div className="absolute inset-0 bg-linear-to-t from-[#07152f] via-transparent to-[#07152f]/30" />

        {/* Hero content */}
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-end px-5 pb-16 pt-24 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#d6b45a]" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e2bd61] sm:text-sm">
                The Redeemed Christian Church of God
              </span>
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              The Pavilion
              <span className="block text-[#e2bd61]">of His Majesty.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              {churchInfo.tagline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/plan-your-visit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d6b45a] px-6 py-3.5 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61] sm:px-7"
              >
                Plan Your Visit
                <ArrowRight size={17} />
              </a>

              <a
                href="#this-week"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 sm:px-7"
              >
                This Week
              </a>
            </div>

            {/* Service information */}
            <div className="mt-12 flex flex-col gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-[#d6b45a]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Sunday
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    8:00 AM – 12:00 PM
                  </p>
                </div>
              </div>

              <div className="hidden h-8 w-px bg-white/15 sm:block" />

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#d6b45a]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Akinmoorin, Oyo State
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-7 right-6 hidden flex-col items-center gap-3 text-white/40 lg:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
            Explore
          </span>
          <span className="h-12 w-px bg-white/20" />
        </div>
      </section>

      {/* =========================================================
          WELCOME
      ========================================================= */}
      <section className="bg-[#f8f6f1] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a18132]">
              Welcome
            </p>

            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#07152f] sm:text-5xl">
              A place to encounter God and grow together.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-[#111827]/70">
              The Pavilion of His Majesty is a parish of The Redeemed Christian
              Church of God, committed to creating a place where people can
              worship, learn God's Word, build meaningful relationships and
              discover their purpose in Christ.
            </p>

            <a
              href="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#07152f] transition hover:text-[#a18132]"
            >
              Discover our story
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          THIS WEEK
      ========================================================= */}
      <section
        id="this-week"
        className="bg-[#07152f] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d6b45a]">
                Gather With Us
              </p>

              <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
                This week at Pavilion.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/55">
              There is always a place for you among us. Join us for worship,
              teaching, prayer and fellowship.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {weeklyProgrammes.map((programme, index) => (
              <div
                key={programme.title}
                className="group bg-[#0b1d3e] p-7 transition hover:bg-[#10264d] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b45a]">
                    {programme.day}
                  </span>

                  <span className="text-xs text-white/35">0{index + 1}</span>
                </div>

                <h3 className="mt-10 font-serif text-2xl font-semibold text-white">
                  {programme.title}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/55">
                  <Clock3 size={16} />
                  {programme.time}
                </div>

                <p className="mt-5 text-sm leading-6 text-white/55">
                  {programme.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ANNIVERSARY
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#102449] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#d6b45a]/20" />
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#d6b45a]/10" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d6b45a]">
              A Milestone of Grace
            </p>

            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              20 Years of God's Faithfulness.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              In December 2026, The Pavilion of His Majesty celebrates two
              decades of God's faithfulness.
            </p>
          </div>

          <a
            href="/events"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d6b45a]/50 px-6 py-3.5 text-sm font-semibold text-[#e2bd61] transition hover:bg-[#d6b45a] hover:text-[#07152f]"
          >
            Explore Anniversary
            <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* =========================================================
          MINISTRIES
      ========================================================= */}
      <section className="bg-[#f8f6f1] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a18132]">
              Find Your Place
            </p>

            <h2 className="mt-4 font-serif text-4xl font-semibold text-[#07152f] sm:text-5xl">
              There is a place for you here.
            </h2>

            <p className="mt-5 text-base leading-7 text-[#111827]/60">
              Discover the different ways people serve, connect and contribute
              to the life of our church.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {featuredMinistries.map((ministry) => (
              <article
                key={ministry.name}
                className="group relative min-h-105 overflow-hidden rounded-2xl bg-[#07152f]"
              >
                <img
                  src={ministryImages[ministry.name]}
                  alt={ministry.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#07152f] via-[#07152f]/55 to-transparent" />

                <div className="relative flex h-full min-h-105 flex-col justify-end p-7 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d6b45a]">
                    Ministry
                  </p>

                  <h3 className="mt-2 font-serif text-3xl font-semibold text-white">
                    {ministry.name}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
                    {ministry.description}
                  </p>

                  <a
                    href="/ministries"
                    className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white"
                  >
                    Learn more
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/ministries"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#07152f] hover:text-[#a18132]"
            >
              Explore all ministries
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          WORSHIP / IMAGE FEATURE
      ========================================================= */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-[#07152f] lg:grid-cols-2">
          <div className="relative min-h-105 lg:min-h-150">
            <img
              src={worshipImage}
              alt="Worship service"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#07152f]/25" />

            <div className="absolute bottom-7 left-7 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#07152f] shadow-xl">
              <Play size={19} fill="currentColor" />
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d6b45a]">
              Worship With Us
            </p>

            <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Come as you are.
              <span className="block text-[#d6b45a]">
                Encounter His presence.
              </span>
            </h2>

            <p className="mt-6 text-base leading-7 text-white/60">
              From worship and prayer to the teaching of God's Word, our
              gatherings are designed to help us encounter God and grow together
              as a people.
            </p>

            <a
              href="/plan-your-visit"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
            >
              Plan Your Visit
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          GET INVOLVED / COOPERATIVE / GIVE
      ========================================================= */}
      <section className="bg-[#f8f6f1] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            <a
              href="/get-involved"
              className="group rounded-2xl bg-[#07152f] p-8 transition hover:-translate-y-1 sm:p-10"
            >
              <HeartHandshake className="text-[#d6b45a]" size={28} />

              <h3 className="mt-12 font-serif text-3xl font-semibold text-white">
                Get Involved
              </h3>

              <p className="mt-4 text-sm leading-6 text-white/55">
                Find opportunities to serve, connect and make a difference.
              </p>

              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#e2bd61]">
                Find your place
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </a>

            <a
              href="/cooperative"
              className="group rounded-2xl border border-[#07152f]/10 bg-white p-8 transition hover:-translate-y-1 sm:p-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07152f] text-[#d6b45a]">
                <HeartHandshake size={21} />
              </div>

              <h3 className="mt-12 font-serif text-3xl font-semibold text-[#07152f]">
                Cooperative
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#111827]/55">
                Learn about our cooperative community and how members can
                participate.
              </p>

              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#07152f]">
                Learn more
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </a>

            <a
              href="/give"
              className="group rounded-2xl border border-[#07152f]/10 bg-[#e9dfc7] p-8 transition hover:-translate-y-1 sm:p-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07152f] text-[#d6b45a]">
                <HeartHandshake size={21} />
              </div>

              <h3 className="mt-12 font-serif text-3xl font-semibold text-[#07152f]">
                Give
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#111827]/60">
                Support the work of the church and help us serve our community.
              </p>

              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#07152f]">
                Ways to give
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          VISIT CTA
      ========================================================= */}
      <section className="bg-[#07152f] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <MapPin className="mx-auto text-[#d6b45a]" size={30} />

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[#d6b45a]">
            Find Us
          </p>

          <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
            We would love to welcome you.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55">
            Lane 4 Oko Oba, Alapini Street, Akinmoorin, Oyo, Oyo State, Nigeria.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/plan-your-visit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d6b45a] px-7 py-3.5 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
            >
              Get Directions
              <ArrowRight size={17} />
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
