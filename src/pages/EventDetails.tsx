import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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
};

function formatDate(date: string) {
  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetails() {
  const { slug } = useParams();
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEvent() {
      setLoading(true);
      setError("");
      setEvent(null);

      if (!slug) {
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("events")
        .select(
          "id, title, slug, short_description, description, category, start_date, end_date, location, image_path",
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        console.error("Unable to load event details:", queryError);
        setError(
          "We couldn't load this event right now. Please try again later.",
        );
      } else {
        setEvent(data as ChurchEvent | null);
      }

      setLoading(false);
    }

    void loadEvent();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#f8f6f1] px-4">
        <p className="text-sm text-gray-500">Loading event details...</p>
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#f8f6f1] px-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a32]">
            Church Event
          </p>

          <h1 className="mt-4 font-serif text-4xl font-semibold text-[#07152f]">
            {error ? "Event unavailable" : "Event not found"}
          </h1>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            {error ||
              "This event may have been removed, unpublished or given a different URL."}
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

  const dateLabel =
    event.end_date &&
    event.end_date.slice(0, 10) !== event.start_date.slice(0, 10)
      ? `${formatDate(event.start_date)} – ${formatDate(event.end_date)}`
      : formatDate(event.start_date);

  return (
    <div className="bg-[#f8f6f1]">
      <section className="relative overflow-hidden bg-[#07152f] text-white">
        {event.image_path && (
          <div className="absolute inset-0">
            <img
              src={event.image_path}
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[#07152f]/85" />

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#e2bd61]"
          >
            <ArrowLeft size={17} />
            Back to Events
          </Link>

          <div className="mt-12">
            {event.category && (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b45a]">
                {event.category}
              </p>
            )}

            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              {event.title}
            </h1>

            <p className="mt-6 text-sm uppercase tracking-[0.12em] text-white/60">
              {dateLabel}
            </p>

            {event.short_description && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">
                {event.short_description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            <article>
              <h2 className="font-serif text-3xl font-semibold text-[#07152f] sm:text-4xl">
                About This Event
              </h2>

              <div className="mt-6 whitespace-pre-wrap wrap-break-word text-base leading-8 text-gray-600">
                {event.description ||
                  event.short_description ||
                  "Further information about this event will be announced soon."}
              </div>
            </article>

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
                      {dateLabel}
                    </p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b18a32]"
                    />
                    <div>
                      <p className="text-xs text-gray-400">Venue</p>
                      <p className="mt-1 text-sm font-semibold text-[#07152f]">
                        {event.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {event.image_path && (
        <section className="bg-[#f8f6f1] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-6xl overflow-hidden">
            <img
              src={event.image_path}
              alt={event.title}
              className="max-h-162.5 w-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="bg-[#07152f] px-4 py-20 text-center text-white sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b45a]">
          Stay Connected
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold">
          We look forward to seeing you.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60">
          Contact the church if you have questions about this event or need
          further information.
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
