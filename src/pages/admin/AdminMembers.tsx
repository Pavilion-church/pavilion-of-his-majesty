import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type Member = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: "member" | "admin" | "super_admin";
  membership_status: "pending" | "approved" | "rejected";
  created_at: string;
};

type MemberStatus = Member["membership_status"];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusStyles: Record<MemberStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
};

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | MemberStatus>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select(
          "id, first_name, last_name, phone, role, membership_status, created_at",
        )
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setMembers((data ?? []) as Member[]);
    } catch (err) {
      console.error("Unable to load members:", err);
      setError(
        "We couldn't load member profiles. Check administrator permissions and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const counts = useMemo(
    () => ({
      total: members.length,
      pending: members.filter((m) => m.membership_status === "pending").length,
      approved: members.filter((m) => m.membership_status === "approved")
        .length,
      rejected: members.filter((m) => m.membership_status === "rejected")
        .length,
    }),
    [members],
  );

  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const name = `${member.first_name ?? ""} ${member.last_name ?? ""}`
        .trim()
        .toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        (member.phone ?? "").toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || member.membership_status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [members, search, filter]);

  async function updateMembershipStatus(member: Member, status: MemberStatus) {
    const label =
      status === "approved"
        ? "approve"
        : status === "rejected"
          ? "reject"
          : "return to pending review";

    if (
      !window.confirm(
        `Are you sure you want to ${label} ${member.first_name ?? ""} ${member.last_name ?? ""}?`,
      )
    ) {
      return;
    }

    setBusyId(member.id);
    setError("");
    setNotice("");

    try {
      const { error: updateError } = await supabase.rpc("set_member_status", {
        target_user_id: member.id,
        new_status: status,
      });

      if (updateError) throw updateError;

      setMembers((current) =>
        current.map((item) =>
          item.id === member.id ? { ...item, membership_status: status } : item,
        ),
      );

      setNotice(`Membership status updated to ${status}.`);
    } catch (err) {
      console.error("Membership status update failed:", err);
      setError("We couldn't update this membership. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#B18A2E]">
            Member administration
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
            Members
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
            View member profiles and manage membership approvals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadMembers()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#07152F]/15 bg-white px-4 py-3 text-sm font-semibold text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50 sm:self-auto"
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
          { label: "Total profiles", value: counts.total },
          { label: "Pending review", value: counts.pending },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
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
                Member directory
              </h2>
              <p className="mt-1 text-sm text-[#07152F]/55">
                {visibleMembers.length} profile
                {visibleMembers.length === 1 ? "" : "s"}
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
                  placeholder="Search name or phone"
                  aria-label="Search members"
                  className="w-full rounded-xl border border-[#07152F]/15 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D6B45A] sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as "all" | MemberStatus)
                }
                aria-label="Filter members by status"
                className="rounded-xl border border-[#07152F]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6B45A]"
              >
                <option value="all">All members</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#07152F]/60">
            <RefreshCw size={19} className="animate-spin text-[#B18A2E]" />
            Loading members...
          </div>
        ) : visibleMembers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users size={30} className="mx-auto text-[#B18A2E]" />
            <h3 className="mt-4 font-semibold text-[#07152F]">
              No members found
            </h3>
            <p className="mt-2 text-sm text-[#07152F]/55">
              Try another search or filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#07152F]/10">
            {visibleMembers.map((member) => {
              const name =
                `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() ||
                "Name not provided";

              const isOrdinaryMember = member.role === "member";

              return (
                <article key={member.id} className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[#07152F]">{name}</h3>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[member.membership_status]}`}
                        >
                          {member.membership_status}
                        </span>
                        {member.role !== "member" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#D6B45A]/40 bg-[#D6B45A]/10 px-2.5 py-1 text-xs font-medium text-[#785B14]">
                            <ShieldCheck size={13} />
                            {member.role.replace("_", " ")}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-[#07152F]/60">
                        {member.phone || "No phone number provided"}
                      </p>
                      <p className="mt-1 text-xs text-[#07152F]/45">
                        Registered {formatDate(member.created_at)}
                      </p>
                    </div>

                    {isOrdinaryMember && (
                      <div className="flex flex-wrap gap-2">
                        {member.membership_status !== "approved" && (
                          <button
                            type="button"
                            disabled={busyId === member.id}
                            onClick={() =>
                              void updateMembershipStatus(member, "approved")
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#07152F] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0d234d] disabled:opacity-50"
                          >
                            <CheckCircle2 size={15} />
                            Approve
                          </button>
                        )}

                        {member.membership_status !== "rejected" && (
                          <button
                            type="button"
                            disabled={busyId === member.id}
                            onClick={() =>
                              void updateMembershipStatus(member, "rejected")
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        )}

                        {member.membership_status !== "pending" && (
                          <button
                            type="button"
                            disabled={busyId === member.id}
                            onClick={() =>
                              void updateMembershipStatus(member, "pending")
                            }
                            className="rounded-lg border border-[#07152F]/15 px-3 py-2 text-sm font-medium text-[#07152F] hover:bg-[#07152F]/5 disabled:opacity-50"
                          >
                            Return to pending
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
