import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCheck,
  Clock3,
  Mail,
  MessageSquareText,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type MessageStatus = "new" | "read" | "resolved";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

const statusStyles: Record<MessageStatus, string> = {
  new: "border-amber-200 bg-amber-50 text-amber-800",
  read: "border-blue-200 bg-blue-50 text-blue-800",
  resolved: "border-green-200 bg-green-50 text-green-800",
};

function normalizeStatus(status: string): MessageStatus {
  if (status === "read" || status === "resolved") return status;
  return "new";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | MessageStatus>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("contact_submissions")
      .select("id, name, email, phone, subject, message, status, created_at")
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Unable to load contact messages:", queryError);
      setError(
        "We couldn't load contact messages. Check your admin permissions and try again.",
      );
    } else {
      setMessages((data ?? []) as ContactMessage[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const counts = useMemo(() => {
    return {
      total: messages.length,
      new: messages.filter((item) => normalizeStatus(item.status) === "new")
        .length,
      read: messages.filter((item) => item.status === "read").length,
      resolved: messages.filter((item) => item.status === "resolved").length,
    };
  }, [messages]);

  const visibleMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((item) => {
      const matchesSearch =
        !query ||
        [item.name, item.email, item.subject, item.message].some((value) =>
          value.toLowerCase().includes(query),
        );

      const matchesFilter =
        filter === "all" || normalizeStatus(item.status) === filter;

      return matchesSearch && matchesFilter;
    });
  }, [messages, search, filter]);

  async function updateStatus(record: ContactMessage, status: MessageStatus) {
    setBusyId(record.id);
    setError("");
    setNotice("");

    const { error: updateError } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", record.id);

    if (updateError) {
      console.error("Unable to update contact message:", updateError);
      setError("We couldn't update this message. Please try again.");
      setBusyId(null);
      return;
    }

    setMessages((current) =>
      current.map((item) =>
        item.id === record.id ? { ...item, status } : item,
      ),
    );

    setSelectedMessage((current) =>
      current?.id === record.id ? { ...current, status } : current,
    );

    setNotice(
      status === "resolved"
        ? "Message marked as resolved."
        : status === "read"
          ? "Message marked as read."
          : "Message marked as new.",
    );

    setBusyId(null);
  }

  function openMessage(record: ContactMessage) {
    setSelectedMessage(record);

    if (normalizeStatus(record.status) === "new") {
      void updateStatus(record, "read");
    }
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#B18A2E]">
            Communications
          </p>

          <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
            Contact messages
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
            Read enquiries sent through the Pavilion website and keep track of
            the messages that still need attention.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadMessages()}
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
          { label: "Total messages", value: counts.total, icon: Mail },
          { label: "New messages", value: counts.new, icon: MessageSquareText },
          { label: "Read", value: counts.read, icon: Clock3 },
          { label: "Resolved", value: counts.resolved, icon: CheckCheck },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#07152F]/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#07152F]/60">{item.label}</p>
                <Icon size={19} className="text-[#B18A2E]" />
              </div>

              <p className="mt-4 text-3xl font-semibold tabular-nums text-[#07152F]">
                {loading ? "—" : item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#07152F]/10 bg-white shadow-sm">
        <div className="border-b border-[#07152F]/10 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#07152F]">Inbox</h2>
              <p className="mt-1 text-sm text-[#07152F]/55">
                {visibleMessages.length} message
                {visibleMessages.length === 1 ? "" : "s"}
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
                  placeholder="Search messages..."
                  aria-label="Search contact messages"
                  className="w-full rounded-xl border border-[#07152F]/15 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D6B45A] sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as "all" | MessageStatus)
                }
                aria-label="Filter contact messages by status"
                className="rounded-xl border border-[#07152F]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6B45A]"
              >
                <option value="all">All messages</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#07152F]/60">
            <RefreshCw size={19} className="animate-spin text-[#B18A2E]" />
            Loading messages...
          </div>
        ) : visibleMessages.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Mail size={30} className="mx-auto text-[#B18A2E]" />
            <h3 className="mt-4 font-semibold text-[#07152F]">
              No messages found
            </h3>
            <p className="mt-2 text-sm text-[#07152F]/55">
              New website enquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#07152F]/10">
            {visibleMessages.map((record) => {
              const status = normalizeStatus(record.status);

              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => openMessage(record)}
                  className="block w-full p-4 text-left transition hover:bg-[#F8F6F1]/70 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[#07152F]">
                          {record.subject}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
                        >
                          {status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#07152F]/70">
                        {record.name} · {record.email}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#07152F]/60">
                        {record.message}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-[#07152F]/45">
                      {formatDate(record.created_at)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07152F]/60 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-message-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#07152F]/10 p-5 sm:p-7">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B18A2E]">
                  Contact enquiry
                </p>

                <h2
                  id="contact-message-title"
                  className="mt-2 font-serif text-2xl text-[#07152F]"
                >
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message"
                className="rounded-full p-2 text-[#07152F]/60 hover:bg-[#07152F]/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#07152F]/45">
                    Sender
                  </p>
                  <p className="mt-1 font-medium text-[#07152F]">
                    {selectedMessage.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#07152F]/45">
                    Submitted
                  </p>
                  <p className="mt-1 text-sm text-[#07152F]">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#07152F]/45">
                    Email
                  </p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="mt-1 block break-all text-sm font-medium text-[#07152F] underline decoration-[#D6B45A] underline-offset-4"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#07152F]/45">
                    Phone
                  </p>
                  {selectedMessage.phone ? (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="mt-1 block text-sm font-medium text-[#07152F] underline decoration-[#D6B45A] underline-offset-4"
                    >
                      {selectedMessage.phone}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-[#07152F]/50">
                      Not provided
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-[#F8F6F1] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#07152F]/50">
                  Message
                </p>
                <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-[#07152F]/80">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#07152F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d234d]"
                >
                  <Mail size={16} />
                  Reply by email
                </a>

                {normalizeStatus(selectedMessage.status) !== "resolved" && (
                  <button
                    type="button"
                    disabled={busyId === selectedMessage.id}
                    onClick={() =>
                      void updateStatus(selectedMessage, "resolved")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-4 py-3 text-sm font-semibold text-green-800 hover:bg-green-50 disabled:opacity-50"
                  >
                    <CheckCheck size={16} />
                    Mark resolved
                  </button>
                )}

                {normalizeStatus(selectedMessage.status) === "resolved" && (
                  <button
                    type="button"
                    disabled={busyId === selectedMessage.id}
                    onClick={() => void updateStatus(selectedMessage, "new")}
                    className="rounded-xl border border-[#07152F]/15 px-4 py-3 text-sm font-semibold text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50"
                  >
                    Reopen message
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
