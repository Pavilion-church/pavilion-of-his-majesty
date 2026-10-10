import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Church,
  Heart,
  HandHeart,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  churchInfo,
  churchStory,
  churchJourney,
  churchLeadership,
  churchValues,
} from "../assets/data";
import churchBuildingImage from "../assets/images/church-building.png";

const valueIcons = [Heart, BookOpen, HandHeart, Church];

export default function About() {
  return (
    <main className="overflow-hidden bg-[#F8F6F1] text-[#07152F]">
      {/* Hero */}
      <section className="relative isolate flex min-h-120 items-center overflow-hidden bg-[#07152F] sm:min-h-140">
        <img
          src={churchBuildingImage}
          alt="The Pavilion of His Majesty church building"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#07152F]/95 via-[#07152F]/80 to-[#07152F]/40" />

        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#E2BD61] sm:text-sm">
              Discover Our Story
            </p>

            <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
              A Legacy of Faith.
              <span className="block text-[#E2BD61]">A People of Purpose.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Every church has a story. Ours is a journey of humble beginnings,
              faith-filled steps and a continuing commitment to the work of God.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#our-story"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D6B45A] px-7 py-4 text-sm font-semibold text-[#07152F] transition hover:bg-[#E8CB7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Our Story
                <ArrowRight size={17} />
              </a>

              <Link
                to="/plan-your-visit"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/35 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#E2BD61] hover:text-[#E2BD61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD61]"
              >
                Plan Your Visit
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D6B45A]/70 to-transparent" />
      </section>

      {/* Introduction */}
      <section
        id="our-story"
        className="scroll-mt-24 px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B18A32]">
              {churchStory.eyebrow}
            </p>

            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {churchStory.title}
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#07152F]/80">
              {churchStory.introduction}
            </p>

            <div className="mt-6 space-y-5">
              {churchStory.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-8 text-[#07152F]/70"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-bl-[3rem] border-b-2 border-l-2 border-[#D6B45A]/70 sm:-bottom-5 sm:-left-5" />

            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={churchBuildingImage}
                alt="The church building at The Pavilion of His Majesty"
                className="h-90 w-full object-cover sm:h-120"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#07152F]/75 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-[#E2BD61]">
                  <Sparkles size={19} />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Established in 2006
                  </span>
                </div>

                <p className="mt-3 max-w-md font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl">
                  From seven members to a growing church family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B18A32]">
              Our Journey
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Milestones Along the Way
            </h2>

            <p className="mt-5 text-base leading-8 text-[#07152F]/65">
              From our first gatherings to the establishment of our permanent
              worship centre, each milestone forms part of our story.
            </p>
          </div>

          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="absolute bottom-8 left-5.75 top-8 w-px bg-[#D6B45A]/50 sm:left-7.75" />

            <div className="space-y-8">
              {churchJourney.map((milestone, index) => (
                <article
                  key={milestone.title}
                  className="relative flex gap-5 sm:gap-8"
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D6B45A]/50 bg-[#07152F] text-[#E2BD61] sm:h-16 sm:w-16">
                    {index === 0 ? (
                      <CalendarDays size={21} />
                    ) : index === 1 ? (
                      <Church size={21} />
                    ) : index === 2 ? (
                      <MapPin size={21} />
                    ) : (
                      <Heart size={21} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 rounded-2xl border border-[#07152F]/10 bg-[#F8F6F1] p-5 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B18A32]">
                      {milestone.year}
                    </p>

                    <h3 className="mt-2 font-serif text-xl font-semibold sm:text-2xl">
                      {milestone.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#07152F]/70 sm:text-base">
                      {milestone.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-3xl bg-[#07152F] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative flex min-h-75 items-center justify-center overflow-hidden bg-[#102951] p-8 sm:min-h-90 lg:min-h-110">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,180,90,0.18),transparent_65%)]" />

              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#E2BD61]/50 bg-[#E2BD61]/10 sm:h-44 sm:w-44">
                <Church
                  size={76}
                  strokeWidth={1}
                  className="text-[#E2BD61] sm:h-24 sm:w-24"
                />
              </div>

              <div className="absolute bottom-7 left-0 right-0 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2BD61]">
                  Pastoral Leadership
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E2BD61]">
                Our Leadership
              </p>

              <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {churchLeadership.pastor}
              </h2>

              <p className="mt-3 text-sm font-medium text-[#E2BD61]">
                {churchLeadership.role}
              </p>

              <div className="mt-6 h-px w-16 bg-[#D6B45A]" />

              <p className="mt-6 text-base leading-8 text-white/75">
                {churchLeadership.introduction}
              </p>

              <p className="mt-5 text-sm leading-7 text-white/60">
                We remain committed to building a church community where people
                can worship God, grow in His Word, pray together and serve
                others.
              </p>

              <div className="mt-8">
                <Link
                  to="/plan-your-visit"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#E2BD61] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD61] focus-visible:ring-offset-4 focus-visible:ring-offset-[#07152F]"
                >
                  Worship with us
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B18A32]">
              What Guides Us
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              The Heart of Our Church
            </h2>

            <p className="mt-5 text-base leading-8 text-[#07152F]/65">
              These are the central parts of our church life and the community
              we seek to nurture.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {churchValues.map((value, index) => {
              const ValueIcon = valueIcons[index] ?? Church;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-[#07152F]/10 bg-[#F8F6F1] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6B45A]/70 hover:shadow-lg hover:shadow-[#07152F]/5 sm:p-7"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#07152F] text-[#E2BD61]">
                    <ValueIcon size={22} strokeWidth={1.8} />
                  </span>

                  <h3 className="mt-6 font-serif text-xl font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#07152F]/65">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visit invitation */}
      <section className="bg-[#07152F] px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E2BD61]">
            You Are Welcome
          </p>

          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Become Part of Our Story.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
            Whether you are new to Oyo, looking for a church family, or seeking
            a place to grow in faith, we would be glad to welcome you to The
            Pavilion of His Majesty.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/plan-your-visit"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D6B45A] px-7 py-4 text-sm font-semibold text-[#07152F] transition hover:bg-[#E8CB7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Plan Your Visit
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#E2BD61] hover:text-[#E2BD61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD61]"
            >
              Get in Touch
            </Link>
          </div>

          <p className="mt-10 text-sm leading-7 text-white/50">
            {churchInfo.name} · {churchInfo.denomination}
          </p>
        </div>
      </section>
    </main>
  );
}
