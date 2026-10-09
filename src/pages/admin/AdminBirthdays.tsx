import { useCallback, useEffect, useState } from "react";
import {
  Cake,
  Download,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type ReviewStatus = "pending" | "approved" | "rejected";
type CelebrationStatus = "pending" | "completed" | "not_required";
type RetentionStatus = "retained" | "review_required" | "deleted";

type BirthdaySubmission = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  birthday_month: number;
  birthday_day: number;
  phone: string | null;
  email: string | null;
  ministry: string | null;
  photo_path: string | null;
  status: ReviewStatus;
  celebration_status: CelebrationStatus;
  celebration_completed_at: string | null;
  photo_retention_status: RetentionStatus;
  photo_deleted_at: string | null;
  created_at: string;
  photoUrl: string | null;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const statusStyles: Record<ReviewStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-green-50 text-green-800 border-green-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function birthdayLabel(record: BirthdaySubmission) {
  return `${months[record.birthday_month - 1]} ${record.birthday_day}`;
}

export default function AdminBirthdays() {
  const [records, setRecords] = useState<BirthdaySubmission[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<BirthdaySubmission | null>(
    null,
  );

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("birthday_submissions")
        .select(
          `
          id,
          user_id,
          first_name,
          last_name,
          birthday_month,
          birthday_day,
          phone,
          email,
          ministry,
          photo_path,
          status,
          celebration_status,
          celebration_completed_at,
          photo_retention_status,
          photo_deleted_at,
          created_at
        `,
        )
        .order("birthday_month", { ascending: true })
        .order("birthday_day", { ascending: true });

      if (queryError) throw queryError;

      const rows = data ?? [];

      const hydrated = await Promise.all(
        rows.map(async (record) => {
          let photoUrl: string | null = null;

          if (
            record.photo_path &&
            record.photo_retention_status !== "deleted"
          ) {
            const { data: signedData, error: signedError } =
              await supabase.storage
                .from("birthday-photos")
                .createSignedUrl(record.photo_path, 300);

            if (signedError) {
              console.error(
                "Could not create birthday photo URL:",
                signedError,
              );
            } else {
              photoUrl = signedData.signedUrl;
            }
          }

          return {
            ...record,
            photoUrl,
          } as BirthdaySubmission;
        }),
      );

      setRecords(hydrated);
    } catch (err) {
      console.error("Unable to load birthday submissions:", err);
      setError(
        "We couldn't load birthday submissions. Check your admin permissions and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  async function updateRecord(
    record: BirthdaySubmission,
    changes: Partial<BirthdaySubmission>,
    successMessage: string,
  ) {
    setBusyId(record.id);
    setError("");
    setNotice("");

    try {
      const { error: updateError } = await supabase
        .from("birthday_submissions")
        .update(changes)
        .eq("id", record.id);

      if (updateError) throw updateError;

      setNotice(successMessage);
      await loadRecords();
    } catch (err) {
      console.error("Birthday update failed:", err);
      setError("We couldn't update this submission. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deletePhoto(record: BirthdaySubmission) {
    if (!record.photo_path) {
      setError("There is no stored photo to delete.");
      return;
    }

    if (record.celebration_status === "pending") {
      setError(
        "Mark the celebration completed or not required before deleting this photo.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete ${record.first_name} ${record.last_name}'s birthday photo from Supabase Storage? This cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(record.id);
    setError("");
    setNotice("");

    try {
      const { error: storageError } = await supabase.storage
        .from("birthday-photos")
        .remove([record.photo_path]);

      if (storageError) throw storageError;

      const { error: updateError } = await supabase
        .from("birthday_submissions")
        .update({
          photo_path: null,
          photo_retention_status: "deleted",
          photo_deleted_at: new Date().toISOString(),
        })
        .eq("id", record.id);

      if (updateError) {
        throw new Error(
          "The photo was deleted, but its database record could not be updated. Refresh and check the record before retrying.",
        );
      }

      setSelectedPhoto(null);
      setNotice(
        "The photo has been deleted from Storage. The birthday record remains.",
      );

      await loadRecords();
    } catch (err) {
      console.error("Photo deletion failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't delete the photo. Please check its status and try again.",
      );
      await loadRecords();
    } finally {
      setBusyId(null);
    }
  }

  async function downloadPhoto(record: BirthdaySubmission) {
    if (!record.photo_path) return;

    setBusyId(record.id);
    setError("");

    try {
      const { data, error: signedError } = await supabase.storage
        .from("birthday-photos")
        .createSignedUrl(record.photo_path, 60, { download: true });

      if (signedError) throw signedError;

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Photo download failed:", err);
      setError("We couldn't prepare the photo download. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  const visibleRecords = records.filter((record) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      `${record.first_name} ${record.last_name}`
        .toLowerCase()
        .includes(query) ||
      (record.email ?? "").toLowerCase().includes(query) ||
      (record.ministry ?? "").toLowerCase().includes(query);

    return matchesSearch && (filter === "all" || record.status === filter);
  });

  const pendingCount = records.filter(
    (record) => record.status === "pending",
  ).length;

  const awaitingCelebration = records.filter(
    (record) =>
      record.status === "approved" && record.celebration_status === "pending",
  ).length;

  const retainedPhotos = records.filter(
    (record) =>
      Boolean(record.photo_path) && record.photo_retention_status !== "deleted",
  ).length;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#B18A2E]">
            <Cake size={17} />
            Member care
          </div>

          <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
            Birthday management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
            Review birthday submissions, prepare celebrations and manage private
            photos responsibly.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadRecords()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#07152F]/15 bg-white px-4 py-3 text-sm font-semibold text-[#07152F] transition hover:bg-[#07152F]/5 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
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
          { label: "Total submissions", value: records.length },
          { label: "Awaiting review", value: pendingCount },
          { label: "Celebrations outstanding", value: awaitingCelebration },
          { label: "Photos retained", value: retainedPhotos },
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
                Birthday submissions
              </h2>
              <p className="mt-1 text-sm text-[#07152F]/55">
                {visibleRecords.length} record
                {visibleRecords.length === 1 ? "" : "s"}
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
                  placeholder="Search name, email, ministry"
                  aria-label="Search birthday submissions"
                  className="w-full rounded-xl border border-[#07152F]/15 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D6B45A] sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as "all" | ReviewStatus)
                }
                aria-label="Filter birthday submissions by review status"
                className="rounded-xl border border-[#07152F]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6B45A]"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#07152F]/60">
            <Loader2 size={20} className="animate-spin text-[#B18A2E]" />
            Loading birthday submissions...
          </div>
        ) : visibleRecords.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Cake size={30} className="mx-auto text-[#B18A2E]" />
            <h3 className="mt-4 font-semibold text-[#07152F]">
              No birthday submissions found
            </h3>
            <p className="mt-2 text-sm text-[#07152F]/55">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#07152F]/10">
            {visibleRecords.map((record) => (
              <article key={record.id} className="p-4 sm:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 gap-4">
                    {record.photoUrl ? (
                      <img
                        src={record.photoUrl}
                        alt={`Birthday photo of ${record.first_name} ${record.last_name}`}
                        className="h-20 w-20 shrink-0 rounded-xl border border-[#07152F]/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F8F6F1] text-[#07152F]/35">
                        <Cake size={25} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#07152F]">
                        {record.first_name} {record.last_name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-[#B18A2E]">
                        {birthdayLabel(record)}
                      </p>

                      <p className="mt-2 break-all text-sm text-[#07152F]/60">
                        {record.email || "No email recorded"}
                      </p>

                      {record.phone && (
                        <p className="mt-1 text-sm text-[#07152F]/60">
                          {record.phone}
                        </p>
                      )}

                      {record.ministry && (
                        <p className="mt-1 text-sm text-[#07152F]/60">
                          Ministry: {record.ministry}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-[#07152F]/45">
                        Submitted {formatDate(record.created_at)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[record.status]}`}
                        >
                          {record.status}
                        </span>

                        <span className="rounded-full border border-[#07152F]/10 bg-[#F8F6F1] px-2.5 py-1 text-xs text-[#07152F]/70">
                          {record.celebration_status === "completed"
                            ? "Celebrated"
                            : record.celebration_status === "not_required"
                              ? "Celebration not required"
                              : "Awaiting celebration"}
                        </span>

                        <span className="rounded-full border border-[#07152F]/10 bg-[#F8F6F1] px-2.5 py-1 text-xs text-[#07152F]/70">
                          {record.photo_path
                            ? "Photo retained"
                            : "Photo deleted"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:max-w-97.5 xl:justify-end">
                    {record.photoUrl && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto(record)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5"
                        >
                          <Eye size={15} />
                          View photo
                        </button>

                        <button
                          type="button"
                          onClick={() => void downloadPhoto(record)}
                          disabled={busyId === record.id}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50"
                        >
                          <Download size={15} />
                          Download
                        </button>
                      </>
                    )}

                    {record.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={busyId === record.id}
                          onClick={() =>
                            void updateRecord(
                              record,
                              { status: "approved" },
                              "Birthday submission approved.",
                            )
                          }
                          className="rounded-lg bg-[#07152F] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0d234d] disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={busyId === record.id}
                          onClick={() =>
                            void updateRecord(
                              record,
                              { status: "rejected" },
                              "Birthday submission rejected.",
                            )
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {record.status === "approved" &&
                      record.celebration_status === "pending" && (
                        <button
                          type="button"
                          disabled={busyId === record.id}
                          onClick={() =>
                            void updateRecord(
                              record,
                              {
                                celebration_status: "completed",
                                celebration_completed_at:
                                  new Date().toISOString(),
                              },
                              "Celebration marked as completed.",
                            )
                          }
                          className="rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-50 disabled:opacity-50"
                        >
                          Mark celebrated
                        </button>
                      )}

                    {record.status === "approved" &&
                      record.celebration_status === "pending" && (
                        <button
                          type="button"
                          disabled={busyId === record.id}
                          onClick={() =>
                            void updateRecord(
                              record,
                              {
                                celebration_status: "not_required",
                                celebration_completed_at: null,
                              },
                              "Celebration marked as not required.",
                            )
                          }
                          className="rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50"
                        >
                          Not required
                        </button>
                      )}

                    {record.photo_path &&
                      record.celebration_status !== "pending" && (
                        <button
                          type="button"
                          disabled={busyId === record.id}
                          onClick={() => void deletePhoto(record)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete photo
                        </button>
                      )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs leading-5 text-[#07152F]/50">
        Birthday photos are private. Signed viewing links expire after five
        minutes. Downloaded copies must be handled securely and deleted when no
        longer needed.
      </p>

      {selectedPhoto?.photoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07152F]/80 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Birthday photo preview"
            className="relative w-full max-w-2xl rounded-2xl bg-white p-4 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo preview"
              className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-[#07152F] shadow hover:bg-[#F8F6F1]"
            >
              <X size={18} />
            </button>

            <h2 className="mb-4 pr-10 font-semibold text-[#07152F]">
              {selectedPhoto.first_name} {selectedPhoto.last_name}
            </h2>

            <img
              src={selectedPhoto.photoUrl}
              alt={`Birthday photo of ${selectedPhoto.first_name} ${selectedPhoto.last_name}`}
              className="max-h-[70vh] w-full rounded-xl bg-[#F8F6F1] object-contain"
            />

            <p className="mt-3 text-sm text-[#07152F]/60">
              {birthdayLabel(selectedPhoto)}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
