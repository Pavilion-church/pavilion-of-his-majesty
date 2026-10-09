
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type ChurchEvent = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  image_path: string | null;
  featured: boolean;
};

function formatDate(date: string) {
  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-NG",
    { day: "numeric", month: "long", year: "numeric" }
  );
}

function formatDateRange(event: ChurchEvent) {
  const start = formatDate(event.start_date);

  if (!event.end_date || event.end_date.slice(0, 10) === event.start_date.slice(0, 10)) {
    return start;
  }

  return `${start} – ${formatDate(event.end_date)}`;
}

export default function Events() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      const today = new Date();
      const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");

      const { data, error: queryError } = await supabase
        .from("events")
        .select(
          "id, title, slug, short_description, description, category, start_date, end_date, location, image_path, featured"
        )
        .eq("status", "published")
        .gte("start_date", todayString)
        .order("start_date", { ascending: true });

      if (queryError) {
        console.error("Unable to load public events:", queryError);
        setError("Events are temporarily unavailable. Please try again later.");
      } else {
        setEvents((data ?? []) as ChurchEvent[]);
      }

      setLoading(false);
    }

    void loadEvents();
  }, []);

  const featuredEvent = events.find((event) => event.featured) ?? events[0];

  return (
    <div className="bg-[#f8f6f1] text-[#111827]">
      <section className="relative overflow-hidden bg-[#07152f] text-white">
        {featuredEvent?.image_path && (
          <div className="absolute inset-0">
            <img
              src={featuredEvent.image_path}
              alt=""
              className="h-full w-full object-cover opacity-20"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[#07152f]/90" />
        <div className="absolute inset-0 bg-linear-to-r from-[#07152f] via-[#07152f]/95 to-[#07152f]/60" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-[#e2bd61]">
              <CalendarDays size={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                Church Events
              </span>
            </div>

            <h1 className="font-serif text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Gather.
              <span className="block text-[#e2bd61]">Celebrate.</span>
              <span className="block">Connect.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Stay connected with what is happening at The Pavilion of His
              Majesty — from special celebrations to gatherings that bring our
              church family together.
            </p>
          </div>
        </div>
      </section>

      {featuredEvent && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mb-10 flex items-center gap-3">
              <Sparkles size={17} className="text-[#b18a32]" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b18a32]">
                Featured Event
              </p>
            </div>

            <article className="grid overflow-hidden bg-[#07152f] lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-80 overflow-hidden bg-[#102653] lg:min-h-140">
                {featuredEvent.image_path ? (
                  <img
                    src={featuredEvent.image_path}
                    alt={featuredEvent.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CalendarDays size={80} className="text-[#d6b45a]/50" />
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-[#07152f]/90 via-transparent to-transparent" />

                {featuredEvent.category && (
                  <div className="absolute bottom-7 left-7 sm:bottom-10 sm:left-10">
                    <span className="inline-flex border border-white/20 bg-[#07152f]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e2bd61] backdrop-blur-md">
                      {featuredEvent.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center px-7 py-12 sm:px-10 lg:px-14 lg:py-16">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d6b45a]">
                  {formatDateRange(featuredEvent)}
                </p>

                <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  {featuredEvent.title}
                </h2>

                <div className="mt-7 h-px w-16 bg-[#d6b45a]" />

                <p className="mt-7 text-sm leading-8 text-white/65 sm:text-base">
                  {featuredEvent.short_description ||
                    featuredEvent.description ||
                    "More information about this event will be announced soon."}
                </p>

                {featuredEvent.location && (
                  <div className="mt-8 flex items-center gap-3 text-sm text-white/75">
                    <MapPin size={18} className="text-[#d6b45a]" />
                    <span>{featuredEvent.location}</span>
                  </div>
                )}

                <div className="mt-10">
                  <Link
                    to={`/events/${featuredEvent.slug}`}
                    className="inline-flex items-center gap-3 border border-[#d6b45a] px-6 py-3.5 text-sm font-semibold text-[#e2bd61] transition hover:bg-[#d6b45a] hover:text-[#07152f]"
                  >
                    Explore Event
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="bg-[#f8f6f1]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b18a32]">
                What&apos;s Happening
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#07152f]">
                Upcoming Events
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-500">
              Keep an eye on this space for upcoming gatherings, celebrations
              and special programmes.
            </p>
          </div>

          {loading ? (
            <p className="mt-10 py-12 text-center text-sm text-gray-500">
              Loading upcoming events...
            </p>
          ) : error ? (
            <p role="alert" className="mt-10 rounded-xl bg-white p-6 text-sm text-red-700">
              {error}
            </p>
          ) : events.length > 0 ? (
            <div className="mt-10 space-y-4">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="group flex flex-col gap-6 border-b border-black/10 py-7 transition hover:bg-white sm:flex-row sm:items-center sm:px-5"
                >
                  <div className="relative h-28 w-full shrink-0 overflow-hidden bg-[#07152f]/5 sm:w-44">
                    {event.image_path ? (
                      <img
                        src={event.image_path}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <CalendarDays size={30} className="text-[#b18a32]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {event.category && (
                        <>
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b18a32]">
                            {event.category}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-black/20" />
                        </>
                      )}

                      <span className="text-xs text-gray-500">
                        {formatDateRange(event)}
                      </span>
                    </div>

                    <h3 className="mt-2 font-serif text-2xl font-semibold text-[#07152f] transition group-hover:text-[#9c7629]">
                      {event.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                      {event.short_description ||
                        event.description ||
                        "More information about this event will be announced soon."}
                    </p>
                  </div>

                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#07152f] transition group-hover:border-[#d6b45a] group-hover:bg-[#07152f] group-hover:text-[#e2bd61] sm:flex">
                    <ChevronRight size={18} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-black/15 bg-white px-6 py-16 text-center">
              <CalendarDays size={30} className="mx-auto text-[#b18a32]" />
              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#07152f]">
                No upcoming events yet
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                New church events and programmes will appear here as they are announced.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b18a32]">
                Every Week
              </p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#07152f] sm:text-5xl">
                There&apos;s always a place to gather.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500">
                Beyond special events, our regular weekly gatherings remain a central part of our life together.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { day: "Tuesday", name: "Digging Deep", time: "5:30 PM – 6:30 PM" },
                { day: "Thursday", name: "Faith Clinic", time: "5:30 PM – 6:30 PM" },
                { day: "Sunday", name: "Sunday Service", time: "8:00 AM – 12:00 PM" },
              ].map((programme) => (
                <div key={programme.day} className="border border-black/10 bg-[#f8f6f1] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b18a32]">
                    {programme.day}
                  </p>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-[#07152f]">
                    {programme.name}
                  </h3>
                  <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                    <Clock3 size={15} />
                    {programme.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07152f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b45a]">
            Plan Your Visit
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            We would love to have you worship with us.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
            Come as you are and experience a community centred on Christ, worship, fellowship and the Word.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/plan-your-visit"
              className="inline-flex items-center justify-center gap-3 bg-[#d6b45a] px-7 py-4 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
            >
              Plan Your Visit
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#d6b45a] hover:text-[#e2bd61]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
