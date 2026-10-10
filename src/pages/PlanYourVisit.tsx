import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Church,
  Clock3,
  HandHeart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

import { churchInfo, weeklyProgrammes } from "../assets/data";
import churchBuildingImage from "../assets/images/church-building.png";

const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(churchInfo.address.full);

const phoneNumber = churchInfo.contact.pastorPhone.replace(/\D/g, "");

const whatsappUrl =
  "https://wa.me/" +
  phoneNumber +
  "?text=" +
  encodeURIComponent(
    "Hello, I would like to know more about visiting The Pavilion of His Majesty.",
  );

const telephoneUrl = "tel:" + churchInfo.contact.pastorPhone.replace(/\s/g, "");

const emailUrl = "mailto:" + churchInfo.contact.email;

const programmeIcons = [BookOpen, HandHeart, Church];

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.34 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.16h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.84c0 4.54-3.7 8.23-8.25 8.23Zm4.53-6.17c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-.1-.74-.33-1.23-.75-1.36-.88-.13-.15-.01-.36.1-.49.12-.12.25-.3.37-.44.12-.15.17-.25.25-.42.09-.17.05-.32-.02-.45-.06-.13-.57-1.38-.78-1.89-.2-.5-.4-.43-.56-.44h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.03 2.59.13.17 1.77 2.7 4.29 3.79.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.09.15-1.19-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

export default function PlanYourVisit() {
  return (
    <main className="overflow-hidden bg-[#F8F6F1] text-[#07152F]">
      {/* Hero */}
      <section className="relative isolate flex min-h-135 items-center overflow-hidden bg-[#07152F] sm:min-h-150">
        <img
          src={churchBuildingImage}
          alt="The Pavilion of His Majesty church building"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#07152F]/95 via-[#07152F]/80 to-[#07152F]/35" />

        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#E2BD61] sm:text-sm">
              Your First Visit
            </p>

            <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
              We'd Love to
              <span className="block text-[#E2BD61]">Welcome You.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              There is a place for you here. Join us for worship, the Word of
              God, prayer and fellowship at {churchInfo.name}.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D6B45A] px-7 py-4 text-sm font-semibold text-[#07152F] transition hover:bg-[#E8CB7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152F]"
              >
                Get Directions
                <ArrowRight size={17} />
              </a>

              <a
                href="#service-times"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#E2BD61] hover:text-[#E2BD61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD61]"
              >
                Service Times
                <ArrowDown size={17} />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D6B45A]/70 to-transparent" />
      </section>

      {/* Welcome introduction */}
      <section className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B18A32]">
              Come As You Are
            </p>

            <h2 className="mt-5 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              A place of His presence.
              <span className="block text-[#B18A32]">
                A people of His purpose.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#07152F]/70">
              Whether you are visiting for the first time, looking for a church
              family, or simply seeking a place to worship, we would be glad to
              have you with us.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#07152F]/70">
              Come and experience a community committed to worship, the teaching
              of God's Word, prayer and fellowship. We look forward to welcoming
              you.
            </p>

            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#07152F] transition hover:text-[#B18A32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B45A] focus-visible:ring-offset-4"
              >
                Discover our church
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-bl-[3rem] border-b-2 border-l-2 border-[#D6B45A]/70 sm:-bottom-5 sm:-left-5" />

            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={churchBuildingImage}
                alt="The Pavilion of His Majesty"
                className="h-80 w-full object-cover sm:h-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#07152F]/65 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                  You are welcome here.
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {churchInfo.denomination}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service times */}
      <section
        id="service-times"
        className="scroll-mt-24 bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B18A32]">
              Join Us in Worship
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Our Weekly Programmes
            </h2>

            <p className="mt-5 text-base leading-7 text-[#07152F]/65">
              Find a convenient time to join us for worship, Bible study and
              prayer.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {weeklyProgrammes.map((programme, index) => {
              const ProgrammeIcon = programmeIcons[index] ?? CalendarDays;

              return (
                <article
                  key={programme.day}
                  className="group flex h-full flex-col rounded-2xl border border-[#07152F]/10 bg-[#F8F6F1] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6B45A]/70 hover:shadow-xl hover:shadow-[#07152F]/5 sm:p-8"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#07152F] text-[#E2BD61] transition group-hover:bg-[#D6B45A] group-hover:text-[#07152F]">
                      <ProgrammeIcon size={22} strokeWidth={1.8} />
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B18A32]">
                      {programme.day}
                    </span>
                  </div>

                  <h3 className="mt-7 font-serif text-2xl font-semibold">
                    {programme.title}
                  </h3>

                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#07152F]/75">
                    <Clock3 size={16} className="shrink-0 text-[#B18A32]" />
                    {programme.time}
                  </p>

                  <p className="mt-5 flex-1 text-sm leading-7 text-[#07152F]/65">
                    {programme.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B18A32]">
              Find Your Way
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              We look forward to seeing you.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#07152F]/70">
              Planning your first visit? Use the address below to find your way
              to {churchInfo.name}. You can also contact us if you need help
              with directions.
            </p>

            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#07152F]/10 bg-white p-5 sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#07152F] text-[#E2BD61]">
                <MapPin size={22} />
              </span>

              <div>
                <h3 className="font-semibold">Our Location</h3>

                <p className="mt-2 text-sm leading-7 text-[#07152F]/65">
                  {churchInfo.address.full}
                </p>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-[#07152F] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#102951] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B45A] focus-visible:ring-offset-4"
            >
              Open Google Maps
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-2xl bg-[#07152F] sm:min-h-100">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(214,180,90,0.2),transparent_55%)]" />

            <div className="relative flex min-h-80 flex-col justify-between p-7 sm:min-h-100 sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E2BD61]/40 bg-[#E2BD61]/10 text-[#E2BD61]">
                <MapPin size={26} />
              </div>

              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2BD61]">
                  Visit Us
                </p>

                <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  {churchInfo.name}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                  {churchInfo.denomination}
                </p>

                <div className="mt-6 flex items-start gap-3 text-sm leading-6 text-white/80">
                  <MapPin size={18} className="mt-1 shrink-0 text-[#E2BD61]" />

                  <span>{churchInfo.address.full}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#07152F] px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E2BD61]">
            We're Here to Help
          </p>

          <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Have a question before you visit?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
            We would be happy to hear from you. Reach out if you need
            directions, want to learn more about our services, or have any
            questions about visiting.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={telephoneUrl}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D6B45A] px-6 py-4 text-sm font-semibold text-[#07152F] transition hover:bg-[#E8CB7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152F]"
            >
              <Phone size={17} />
              Call Us
            </a>

            <a
              href={emailUrl}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 px-6 py-4 text-sm font-semibold text-white transition hover:border-[#E2BD61] hover:text-[#E2BD61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD61]"
            >
              <Mail size={17} />
              Send an Email
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 px-6 py-4 text-sm font-semibold text-white transition hover:border-[#E2BD61] hover:text-[#E2BD61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD61]"
            >
              <span className="inline-flex shrink-0 items-center justify-center">
                <WhatsAppIcon size={23} />
              </span>
              WhatsApp
            </a>
          </div>

          <div className="mt-14 border-t border-white/10 pt-8">
            <p className="text-sm leading-7 text-white/60">
              We look forward to worshipping with you.
            </p>

            <Link
              to="/ministries"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#E2BD61] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2BD61] focus-visible:ring-offset-4 focus-visible:ring-offset-[#07152F]"
            >
              Explore our ministries
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
