import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type EventStatus = "draft" | "published" | "archived";

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
  status: EventStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type EventForm = {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;

  featured: boolean;
  status: EventStatus;
};

const emptyForm: EventForm = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  category: "Church Programme",
  start_date: "",
  end_date: "",
  location: "",
  featured: false,
  status: "draft",
};

const statusStyles: Record<EventStatus, string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-800",
  published: "border-green-200 bg-green-50 text-green-800",
  archived: "border-gray-200 bg-gray-100 text-gray-700",
};

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateTimeInput(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getEventForm(event: ChurchEvent): EventForm {
  return {
    title: event.title,
    slug: event.slug,
    short_description: event.short_description ?? "",
    description: event.description ?? "",
    category: event.category ?? "Church Programme",
    start_date: toDateTimeInput(event.start_date),
    end_date: toDateTimeInput(event.end_date),
    location: event.location ?? "",
    featured: event.featured,
    status: event.status,
  };
}

export default function AdminEvents() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | EventStatus>("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("events")
        .select(
          `
          id,
          title,
          slug,
          short_description,
          description,
          category,
          start_date,
          end_date,
          location,
          image_path,
          featured,
          status,
          published_at,
          created_at,
          updated_at
        `,
        )
        .order("start_date", { ascending: true });

      if (queryError) throw queryError;

      setEvents((data ?? []) as ChurchEvent[]);
    } catch (err) {
      console.error("Unable to load events:", err);
      setError(
        "We couldn't load events. Check your administrator permissions and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        [
          event.title,
          event.slug,
          event.category ?? "",
          event.location ?? "",
        ].some((value) => value.toLowerCase().includes(query));

      return matchesSearch && (filter === "all" || event.status === filter);
    });
  }, [events, search, filter]);

  const counts = useMemo(
    () => ({
      total: events.length,
      published: events.filter((event) => event.status === "published").length,
      drafts: events.filter((event) => event.status === "draft").length,
      archived: events.filter((event) => event.status === "archived").length,
    }),
    [events],
  );

  function openCreateForm() {
    setEditingEvent(null);
    setForm(emptyForm);
    setSlugManuallyEdited(false);
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function openEditForm(event: ChurchEvent) {
    setEditingEvent(event);
    setForm(getEventForm(event));
    setSlugManuallyEdited(true);
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function updateTitle(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugManuallyEdited ? current.slug : makeSlug(value),
    }));
  }

  function updateField<K extends keyof EventForm>(
    field: K,
    value: EventForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const title = form.title.trim();
    const slug = makeSlug(form.slug);
    const shortDescription = form.short_description.trim();
    const description = form.description.trim();
    const category = form.category.trim();
    const location = form.location.trim();

    if (!title) {
      setError("Please enter an event title.");
      return;
    }

    if (!slug) {
      setError("Please enter a valid event URL slug.");
      return;
    }

    if (!form.start_date) {
      setError("Please select the event start date and time.");
      return;
    }

    const startDate = new Date(form.start_date);
    const endDate = form.end_date ? new Date(form.end_date) : null;

    if (Number.isNaN(startDate.getTime())) {
      setError("Please enter a valid start date and time.");
      return;
    }

    if (endDate && Number.isNaN(endDate.getTime())) {
      setError("Please enter a valid end date and time.");
      return;
    }

    if (endDate && endDate < startDate) {
      setError("The event end date cannot be earlier than its start date.");
      return;
    }

    if (title.length > 150) {
      setError("The event title cannot exceed 150 characters.");
      return;
    }

    if (slug.length > 180) {
      setError("The event URL slug is too long.");
      return;
    }

    if (shortDescription.length > 300) {
      setError("The short description cannot exceed 300 characters.");
      return;
    }

    if (category.length > 80) {
      setError("The event category cannot exceed 80 characters.");
      return;
    }

    if (location.length > 200) {
      setError("The event location cannot exceed 200 characters.");
      return;
    }

    const startISO = startDate.toISOString();
    const endISO = endDate?.toISOString() ?? null;

    const existingPublishedAt = editingEvent?.published_at ?? null;

    const payload = {
      title,
      slug,
      short_description: shortDescription || null,
      description: description || null,
      category: category || null,
      start_date: startISO,
      end_date: endISO,
      location: location || null,
      featured: form.featured,
      status: form.status,
      published_at:
        form.status === "published"
          ? (existingPublishedAt ?? new Date().toISOString())
          : existingPublishedAt,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);

    try {
      if (editingEvent) {
        const { error: updateError } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingEvent.id);

        if (updateError) throw updateError;

        setNotice("Event updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("events")
          .insert(payload);

        if (insertError) throw insertError;

        setNotice(
          form.status === "published"
            ? "Event created and published successfully."
            : "Event saved successfully.",
        );
      }

      setEditorOpen(false);
      setEditingEvent(null);
      setForm(emptyForm);

      await loadEvents();
    } catch (err) {
      console.error("Event save failed:", err);

      const message =
        err && typeof err === "object" && "code" in err && err.code === "23505"
          ? "That event URL slug is already in use. Choose a different slug."
          : "We couldn't save this event. Please check your details and try again.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(event: ChurchEvent, status: EventStatus) {
    setBusyId(event.id);
    setError("");
    setNotice("");

    const payload = {
      status,
      published_at:
        status === "published"
          ? (event.published_at ?? new Date().toISOString())
          : event.published_at,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: updateError } = await supabase
        .from("events")
        .update(payload)
        .eq("id", event.id);

      if (updateError) throw updateError;

      setNotice(
        status === "published"
          ? "Event published."
          : status === "archived"
            ? "Event archived."
            : "Event moved to drafts.",
      );

      await loadEvents();
    } catch (err) {
      console.error("Event status update failed:", err);
      setError("We couldn't change the event status. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteEvent(event: ChurchEvent) {
    const confirmed = window.confirm(
      `Permanently delete "${event.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(event.id);
    setError("");
    setNotice("");

    try {
      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (deleteError) throw deleteError;

      setNotice("Event deleted.");
      await loadEvents();
    } catch (err) {
      console.error("Event deletion failed:", err);
      setError("We couldn't delete this event. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#B18A2E]">
            Church programmes
          </p>

          <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
            Events management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
            Create and manage church programmes, publish event details, and keep
            the public calendar up to date.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#07152F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0d234d] sm:self-auto"
        >
          <Plus size={17} />
          Create event
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800"
        >
          {notice}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total events", value: counts.total },
          { label: "Published", value: counts.published },
          { label: "Drafts", value: counts.drafts },
          { label: "Archived", value: counts.archived },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#07152F]/10 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-[#07152F]/60">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-[#07152F]">
              {loading ? "—" : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#07152F]/10 bg-white shadow-sm">
        <div className="border-b border-[#07152F]/10 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#07152F]">Events</h2>
              <p className="mt-1 text-sm text-[#07152F]/55">
                {visibleEvents.length} event
                {visibleEvents.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07152F]/40"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search events..."
                  aria-label="Search events"
                  className="w-full rounded-xl border border-[#07152F]/15 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D6B45A] sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as "all" | EventStatus)
                }
                aria-label="Filter events by status"
                className="rounded-xl border border-[#07152F]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6B45A]"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <button
                type="button"
                onClick={() => void loadEvents()}
                disabled={loading}
                aria-label="Refresh events"
                className="inline-flex items-center justify-center rounded-xl border border-[#07152F]/15 px-3 py-2.5 text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#07152F]/60">
            <Loader2 size={20} className="animate-spin text-[#B18A2E]" />
            Loading events...
          </div>
        ) : visibleEvents.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CalendarDays size={30} className="mx-auto text-[#B18A2E]" />
            <h3 className="mt-4 font-semibold text-[#07152F]">
              No events found
            </h3>
            <p className="mt-2 text-sm text-[#07152F]/55">
              Create an event or change your search and filter.
            </p>
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#07152F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d234d]"
            >
              <Plus size={16} />
              Create event
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#07152F]/10">
            {visibleEvents.map((event) => (
              <article key={event.id} className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#07152F]">
                        {event.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[event.status]}`}
                      >
                        {event.status}
                      </span>
                      {event.featured && (
                        <span className="rounded-full border border-[#D6B45A]/40 bg-[#D6B45A]/10 px-2.5 py-1 text-xs font-medium text-[#785B14]">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-[#07152F]/60">
                      {event.category || "Church Programme"}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#07152F]/80">
                      {formatDate(event.start_date)}
                      {event.end_date ? ` – ${formatDate(event.end_date)}` : ""}
                    </p>

                    {event.short_description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#07152F]/60">
                        {event.short_description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-[#07152F]/45">
                      URL: /events/{event.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {event.status !== "published" && (
                      <button
                        type="button"
                        disabled={busyId === event.id}
                        onClick={() => void changeStatus(event, "published")}
                        className="rounded-lg bg-[#07152F] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0d234d] disabled:opacity-50"
                      >
                        Publish
                      </button>
                    )}

                    {event.status === "published" && (
                      <a
                        href={`/events/${encodeURIComponent(event.slug)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5"
                      >
                        <Eye size={15} />
                        View page
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditForm(event)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    {event.status !== "archived" && (
                      <button
                        type="button"
                        disabled={busyId === event.id}
                        onClick={() => void changeStatus(event, "archived")}
                        className="rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50"
                      >
                        Archive
                      </button>
                    )}

                    {event.status !== "draft" && (
                      <button
                        type="button"
                        disabled={busyId === event.id}
                        onClick={() => void changeStatus(event, "draft")}
                        className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-50"
                      >
                        Move to draft
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={busyId === event.id}
                      onClick={() => void deleteEvent(event)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07152F]/60 p-3 sm:p-6"
          onClick={() => !saving && setEditorOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-editor-title"
            className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#07152F]/10 p-5 sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B18A2E]">
                  Event editor
                </p>
                <h2
                  id="event-editor-title"
                  className="mt-2 font-serif text-2xl text-[#07152F]"
                >
                  {editingEvent ? "Edit event" : "Create an event"}
                </h2>
                <p className="mt-2 text-sm text-[#07152F]/60">
                  Fields marked required must be completed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                disabled={saving}
                aria-label="Close event editor"
                className="rounded-full p-2 text-[#07152F]/60 hover:bg-[#07152F]/5 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 p-5 sm:p-7">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-title"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Event title
                  </label>
                  <input
                    id="event-title"
                    value={form.title}
                    onChange={(event) => updateTitle(event.target.value)}
                    maxLength={150}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                    placeholder="e.g. Sunday Thanksgiving Service"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-slug"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Event URL slug
                  </label>
                  <input
                    id="event-slug"
                    value={form.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      updateField("slug", makeSlug(event.target.value));
                    }}
                    maxLength={180}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  />
                  <p className="mt-2 text-xs text-[#07152F]/50">
                    Used in the event page URL. Keep it unique.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="event-category"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Category
                  </label>
                  <input
                    id="event-category"
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    maxLength={80}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                    placeholder="Church Programme"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-location"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Location
                  </label>
                  <input
                    id="event-location"
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    maxLength={200}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                    placeholder="Church auditorium"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-start"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Start date and time
                  </label>
                  <input
                    id="event-start"
                    type="datetime-local"
                    value={form.start_date}
                    onChange={(event) =>
                      updateField("start_date", event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-end"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    End date and time (optional)
                  </label>
                  <input
                    id="event-end"
                    type="datetime-local"
                    value={form.end_date}
                    onChange={(event) =>
                      updateField("end_date", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-short-description"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Short description
                  </label>
                  <textarea
                    id="event-short-description"
                    value={form.short_description}
                    onChange={(event) =>
                      updateField("short_description", event.target.value)
                    }
                    maxLength={300}
                    rows={2}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                    placeholder="A short introduction to the event"
                  />
                  <p className="mt-1 text-right text-xs text-[#07152F]/45">
                    {form.short_description.length}/300
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-description"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Full description
                  </label>
                  <textarea
                    id="event-description"
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    rows={5}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                    placeholder="Event details, programme information and what attendees should know"
                  />
                </div>

                <div className="sm:col-span-2 rounded-xl bg-[#F8F6F1] p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        updateField("featured", event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-[#07152F]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-[#07152F]">
                        Feature this event
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#07152F]/55">
                        Use the existing featured flag to highlight this event
                        where supported.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-status"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Publication status
                  </label>
                  <select
                    id="event-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value as EventStatus)
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  >
                    <option value="draft">Draft — not public</option>
                    <option value="published">
                      Published — visible publicly
                    </option>
                    <option value="archived">
                      Archived — no longer active
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#07152F]/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditorOpen(false)}
                  className="rounded-xl border border-[#07152F]/15 px-5 py-3 text-sm font-semibold text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0d234d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={17} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingEvent
                      ? "Save changes"
                      : "Create event"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
