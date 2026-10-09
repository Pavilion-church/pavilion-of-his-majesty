import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  CalendarClock,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type AnnouncementStatus = "draft" | "published";

type Announcement = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  priority: string;
  status: AnnouncementStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

type AnnouncementForm = {
  title: string;
  excerpt: string;
  content: string;
  priority: string;
  status: AnnouncementStatus;
  expires_at: string;
};

const emptyForm: AnnouncementForm = {
  title: "",
  excerpt: "",
  content: "",
  priority: "normal",
  status: "draft",
  expires_at: "",
};

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
  if (!value) return "Not set";

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

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | AnnouncementStatus>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("announcements")
        .select(
          "id, title, excerpt, content, priority, status, published_at, expires_at, created_at, updated_at",
        )
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setAnnouncements((data ?? []) as Announcement[]);
    } catch (err) {
      console.error("Unable to load announcements:", err);
      setError(
        "We couldn't load announcements. Check administrator permissions and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnnouncements();
  }, [loadAnnouncements]);

  const counts = useMemo(
    () => ({
      total: announcements.length,
      published: announcements.filter((item) => item.status === "published")
        .length,
      drafts: announcements.filter((item) => item.status === "draft").length,
    }),
    [announcements],
  );

  const visibleAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements.filter((item) => {
      const matchesSearch =
        !query ||
        [item.title, item.excerpt ?? "", item.content].some((value) =>
          value.toLowerCase().includes(query),
        );

      return matchesSearch && (filter === "all" || item.status === filter);
    });
  }, [announcements, search, filter]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function openEdit(item: Announcement) {
    setEditing(item);
    setForm({
      title: item.title,
      excerpt: item.excerpt ?? "",
      content: item.content,
      priority: item.priority || "normal",
      status: item.status,
      expires_at: toDateTimeInput(item.expires_at),
    });
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function updateField<K extends keyof AnnouncementForm>(
    field: K,
    value: AnnouncementForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const title = form.title.trim();
    const excerpt = form.excerpt.trim();
    const content = form.content.trim();
    const priority = form.priority.trim();

    if (!title) {
      setError("Please enter an announcement title.");
      return;
    }

    if (title.length > 180) {
      setError("The title cannot exceed 180 characters.");
      return;
    }

    if (!content) {
      setError("Please enter the announcement content.");
      return;
    }

    if (excerpt.length > 300) {
      setError("The excerpt cannot exceed 300 characters.");
      return;
    }

    if (!priority || priority.length > 40) {
      setError("Please enter a valid priority.");
      return;
    }

    const expiryDate = form.expires_at ? new Date(form.expires_at) : null;

    if (expiryDate && Number.isNaN(expiryDate.getTime())) {
      setError("Please enter a valid expiry date.");
      return;
    }

    if (expiryDate && expiryDate <= new Date()) {
      setError("The expiry date must be in the future.");
      return;
    }

    const payload = {
      title,
      excerpt: excerpt || null,
      content,
      priority,
      status: form.status,
      published_at:
        form.status === "published"
          ? (editing?.published_at ?? new Date().toISOString())
          : (editing?.published_at ?? null),
      expires_at: expiryDate?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);

    try {
      if (editing) {
        const { error: updateError } = await supabase
          .from("announcements")
          .update(payload)
          .eq("id", editing.id);

        if (updateError) throw updateError;

        setNotice("Announcement updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("announcements")
          .insert(payload);

        if (insertError) throw insertError;

        setNotice(
          form.status === "published"
            ? "Announcement published successfully."
            : "Announcement saved as a draft.",
        );
      }

      setEditorOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await loadAnnouncements();
    } catch (err) {
      console.error("Announcement save failed:", err);
      setError(
        "We couldn't save the announcement. Check the priority and status values allowed by your database, then try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(item: Announcement, status: AnnouncementStatus) {
    setBusyId(item.id);
    setError("");
    setNotice("");

    const payload = {
      status,
      published_at:
        status === "published"
          ? (item.published_at ?? new Date().toISOString())
          : item.published_at,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: updateError } = await supabase
        .from("announcements")
        .update(payload)
        .eq("id", item.id);

      if (updateError) throw updateError;

      setNotice(
        status === "published"
          ? "Announcement published."
          : "Announcement moved to drafts.",
      );

      await loadAnnouncements();
    } catch (err) {
      console.error("Announcement status update failed:", err);
      setError("We couldn't update the announcement status.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteAnnouncement(item: Announcement) {
    const confirmed = window.confirm(
      `Permanently delete "${item.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(item.id);
    setError("");
    setNotice("");

    try {
      const { error: deleteError } = await supabase
        .from("announcements")
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      setNotice("Announcement deleted.");
      await loadAnnouncements();
    } catch (err) {
      console.error("Announcement deletion failed:", err);
      setError("We couldn't delete the announcement.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#B18A2E]">
            Church communications
          </p>

          <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
            Announcements
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
            Share important updates with the congregation and manage
            announcements displayed on the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#07152F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d234d] sm:self-auto"
        >
          <Plus size={17} />
          New announcement
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

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total announcements", value: counts.total },
          { label: "Published", value: counts.published },
          { label: "Drafts", value: counts.drafts },
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
              <h2 className="text-lg font-semibold text-[#07152F]">
                Announcement library
              </h2>
              <p className="mt-1 text-sm text-[#07152F]/55">
                {visibleAnnouncements.length} announcement
                {visibleAnnouncements.length === 1 ? "" : "s"}
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
                  placeholder="Search announcements..."
                  aria-label="Search announcements"
                  className="w-full rounded-xl border border-[#07152F]/15 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D6B45A] sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as "all" | AnnouncementStatus)
                }
                aria-label="Filter announcements"
                className="rounded-xl border border-[#07152F]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6B45A]"
              >
                <option value="all">All statuses</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
              </select>

              <button
                type="button"
                onClick={() => void loadAnnouncements()}
                disabled={loading}
                aria-label="Refresh announcements"
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
            Loading announcements...
          </div>
        ) : visibleAnnouncements.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Megaphone size={30} className="mx-auto text-[#B18A2E]" />
            <h3 className="mt-4 font-semibold text-[#07152F]">
              No announcements found
            </h3>
            <p className="mt-2 text-sm text-[#07152F]/55">
              Create an announcement or adjust your search.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#07152F]/10">
            {visibleAnnouncements.map((item) => (
              <article key={item.id} className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#07152F]">
                        {item.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          item.status === "published"
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#07152F]/55">
                      Priority: {item.priority || "normal"}
                    </p>

                    {item.excerpt && (
                      <p className="mt-2 text-sm leading-6 text-[#07152F]/70">
                        {item.excerpt}
                      </p>
                    )}

                    <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[#07152F]/60">
                      {item.content}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#07152F]/45">
                      <span>Created {formatDate(item.created_at)}</span>
                      {item.published_at && (
                        <span>Published {formatDate(item.published_at)}</span>
                      )}
                      {item.expires_at && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock size={13} />
                          Expires {formatDate(item.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {item.status !== "published" && (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => void changeStatus(item, "published")}
                        className="rounded-lg bg-[#07152F] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0d234d] disabled:opacity-50"
                      >
                        Publish
                      </button>
                    )}

                    {item.status === "published" && (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => void changeStatus(item, "draft")}
                        className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-50"
                      >
                        Unpublish
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => void deleteAnnouncement(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
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
            aria-labelledby="announcement-editor-title"
            className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#07152F]/10 p-5 sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B18A2E]">
                  Church communications
                </p>
                <h2
                  id="announcement-editor-title"
                  className="mt-2 font-serif text-2xl text-[#07152F]"
                >
                  {editing ? "Edit announcement" : "New announcement"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                disabled={saving}
                aria-label="Close announcement editor"
                className="rounded-full p-2 text-[#07152F]/60 hover:bg-[#07152F]/5 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-7">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="announcement-title"
                  className="mb-2 block text-sm font-medium text-[#111827]"
                >
                  Title
                </label>
                <input
                  id="announcement-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  maxLength={180}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  placeholder="e.g. Important Sunday Service Update"
                />
              </div>

              <div>
                <label
                  htmlFor="announcement-excerpt"
                  className="mb-2 block text-sm font-medium text-[#111827]"
                >
                  Short summary (optional)
                </label>
                <textarea
                  id="announcement-excerpt"
                  value={form.excerpt}
                  onChange={(event) =>
                    updateField("excerpt", event.target.value)
                  }
                  maxLength={300}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  placeholder="A brief summary for the website"
                />
                <p className="mt-1 text-right text-xs text-[#07152F]/45">
                  {form.excerpt.length}/300
                </p>
              </div>

              <div>
                <label
                  htmlFor="announcement-content"
                  className="mb-2 block text-sm font-medium text-[#111827]"
                >
                  Announcement content
                </label>
                <textarea
                  id="announcement-content"
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  rows={7}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  placeholder="Write the full announcement..."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="announcement-priority"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Priority
                  </label>
                  <select
                    id="announcement-priority"
                    value={form.priority}
                    onChange={(event) =>
                      updateField("priority", event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="announcement-status"
                    className="mb-2 block text-sm font-medium text-[#111827]"
                  >
                    Status
                  </label>
                  <select
                    id="announcement-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as AnnouncementStatus,
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                  >
                    <option value="draft">Draft — not public</option>
                    <option value="published">
                      Published — visible publicly
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="announcement-expiry"
                  className="mb-2 block text-sm font-medium text-[#111827]"
                >
                  Expiry date and time (optional)
                </label>
                <input
                  id="announcement-expiry"
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(event) =>
                    updateField("expires_at", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20"
                />
                <p className="mt-2 text-xs leading-5 text-[#07152F]/50">
                  Published announcements past this time should no longer appear
                  publicly.
                </p>
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
                    : editing
                      ? "Save changes"
                      : "Create announcement"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
