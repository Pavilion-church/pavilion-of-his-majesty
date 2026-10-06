import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { events } from "../assets/data";

export default function EventDetails() {
  const { slug } = useParams();

  const event = events.find((item) => item.slug === slug);

  if (!event) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#f8f6f1] px-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a32]">
            Event
          </p>

          <h1 className="mt-4 font-serif text-4xl font-semibold text-[#07152f]">
            Event not found
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            The event you are looking for may have been removed or updated.
          </p>

          <Link
            to="/events"
            className="mt-7 inline-flex items-center gap-2 bg-[#07152f] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Back to Events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#f8f6f1]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07152f] text-white">
        <div className="absolute inset-0">
          <img
            src={event.image}
            alt=""
            className="h-full w-full object-cover opacity-25"
          />

          <div className="absolute inset-0 bg-[#07152f]/85" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#e2bd61]"
          >
            <ArrowLeft size={17} />
            Back to Events
          </Link>

          <div className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b45a]">
              {event.category}
            </p>

            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              {event.title}
            </h1>

            <p className="mt-6 text-sm uppercase tracking-[0.18em] text-white/50">
              {event.dateLabel}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-[#07152f] sm:text-4xl">
                20 Years of God&apos;s Faithfulness
              </h2>

              <p className="mt-6 text-base leading-8 text-gray-600">
                The Pavilion of His Majesty is grateful to celebrate two decades
                of God&apos;s faithfulness. This special anniversary season is
                an opportunity to remember the journey, celebrate what God has
                done and look forward to the years ahead.
              </p>

              <p className="mt-5 text-base leading-8 text-gray-600">
                More details about the anniversary programme, special gatherings
                and ways to participate will be announced as the celebration
                approaches.
              </p>
            </div>

            <aside className="h-fit border border-black/10 bg-[#f8f6f1] p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#b18a32]">
                Event Information
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="mt-0.5 shrink-0 text-[#b18a32]"
                  />

                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="mt-1 text-sm font-semibold text-[#07152f]">
                      December 2026
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#b18a32]"
                  />

                  <div>
                    <p className="text-xs text-gray-400">Venue</p>
                    <p className="mt-1 text-sm font-semibold text-[#07152f]">
                      The Pavilion of His Majesty
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* IMAGE */}
      <section className="bg-[#f8f6f1] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-6xl overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="max-h-162.5 w-full object-cover"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#07152f] px-4 py-20 text-center text-white sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b45a]">
          Stay Connected
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold">
          More details will be announced soon.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60">
          Keep connected with The Pavilion of His Majesty for updates about this
          special celebration.
        </p>

        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 border border-[#d6b45a] px-7 py-4 text-sm font-semibold text-[#e2bd61] transition hover:bg-[#d6b45a] hover:text-[#07152f]"
        >
          Contact the Church
        </Link>
      </section>
    </div>
  );
}
