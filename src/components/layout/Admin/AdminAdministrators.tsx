import { useCallback, useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import {
  AlertCircle,
  LoaderCircle,
  RefreshCw,
  Shield,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../layout/auth/AuthProvider";

type AccountRole = "member" | "admin" | "super_admin";

type AccountProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: AccountRole;
  membership_status: "pending" | "approved" | "rejected";
  created_at: string;
};

const roleLabels: Record<AccountRole, string> = {
  member: "Member",
  admin: "Administrator",
  super_admin: "Super Admin",
};

const roleStyles: Record<AccountRole, string> = {
  member: "bg-slate-100 text-slate-700",
  admin: "bg-blue-50 text-blue-700",
  super_admin: "bg-amber-50 text-amber-800",
};

export default function AdminAdministrators() {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<AccountProfile[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<
    Record<string, AccountRole>
  >({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{
    account: AccountProfile;
    nextRole: AccountRole;
  } | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, phone, role, membership_status, created_at",
      )
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Unable to load account profiles:", queryError);
      setError("We couldn't load the accounts. Please refresh and try again.");
      toast.error("We couldn't load accounts. Please try again.");
      setLoading(false);
      return;
    }

    const validAccounts = (data ?? []) as AccountProfile[];

    setAccounts(validAccounts);
    setSelectedRoles(
      Object.fromEntries(
        validAccounts.map((account) => [account.id, account.role]),
      ),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  function requestRoleChange(account: AccountProfile) {
    const nextRole = selectedRoles[account.id];

    setError("");

    if (!nextRole || nextRole === account.role) return;

    if (account.id === user?.id) {
      toast.error("You cannot change your own role here.");
      setSelectedRoles((current) => ({
        ...current,
        [account.id]: account.role,
      }));
      return;
    }

    setConfirmation({ account, nextRole });
  }

  async function confirmRoleChange() {
    if (!confirmation) return;

    const { account, nextRole } = confirmation;

    if (account.id === user?.id || nextRole === account.role) {
      setConfirmation(null);
      return;
    }

    const accountName =
      [account.first_name, account.last_name].filter(Boolean).join(" ") ||
      "This account";

    setSavingId(account.id);

    try {
      const { error: rpcError } = await supabase.rpc("set_account_role", {
        target_user_id: account.id,
        new_role: nextRole,
      });

      if (rpcError) throw rpcError;

      setAccounts((current) =>
        current.map((item) =>
          item.id === account.id ? { ...item, role: nextRole } : item,
        ),
      );

      setSelectedRoles((current) => ({
        ...current,
        [account.id]: nextRole,
      }));

      setConfirmation(null);
      toast.success(`${accountName}'s role is now ${roleLabels[nextRole]}.`);
    } catch (err) {
      console.error("Unable to update account role:", err);

      setSelectedRoles((current) => ({
        ...current,
        [account.id]: account.role,
      }));

      setConfirmation(null);
      toast.error("We couldn't update this account's role. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  const administratorCount = accounts.filter(
    (account) => account.role === "admin",
  ).length;

  const superAdminCount = accounts.filter(
    (account) => account.role === "super_admin",
  ).length;

  const confirmationName = confirmation
    ? [confirmation.account.first_name, confirmation.account.last_name]
        .filter(Boolean)
        .join(" ") || "this account"
    : "";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A17B26]">
              Access and permissions
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-[#07152F] sm:text-4xl">
              Administrator management
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#07152F]/65">
              Manage account roles for the Pavilion administration workspace.
              Only Super Admins can make role changes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadAccounts()}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#07152F]/15 bg-white px-4 py-3 text-sm font-medium text-[#07152F] transition hover:bg-[#07152F]/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh accounts
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total accounts"
          value={accounts.length}
          icon={<Users size={20} />}
        />
        <SummaryCard
          label="Administrators"
          value={administratorCount}
          icon={<Shield size={20} />}
        />
        <SummaryCard
          label="Super Admins"
          value={superAdminCount}
          icon={<ShieldCheck size={20} />}
        />
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#07152F]/10 bg-white shadow-sm">
        <div className="border-b border-[#07152F]/10 px-5 py-5 sm:px-6">
          <h2 className="font-semibold text-[#07152F]">Registered accounts</h2>
          <p className="mt-1 text-sm text-[#07152F]/55">
            Choose a role and save the change for the relevant account.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-[#07152F]/60">
            <LoaderCircle size={20} className="animate-spin" />
            Loading accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#07152F]/60">
            No account profiles were found.
          </div>
        ) : (
          <div className="divide-y divide-[#07152F]/10">
            {accounts.map((account) => {
              const name =
                [account.first_name, account.last_name]
                  .filter(Boolean)
                  .join(" ") || "Unnamed account";

              const isSelf = account.id === user?.id;
              const isSaving = savingId === account.id;

              return (
                <article
                  key={account.id}
                  className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#07152F]/5 text-[#07152F]">
                      {account.role === "super_admin" ? (
                        <ShieldCheck size={20} />
                      ) : account.role === "admin" ? (
                        <Shield size={20} />
                      ) : (
                        <Users size={20} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="wrap-break-word font-semibold text-[#07152F]">
                          {name}
                        </h3>

                        {isSelf && (
                          <span className="rounded-full bg-[#07152F]/5 px-2.5 py-1 text-xs font-medium text-[#07152F]/70">
                            Your account
                          </span>
                        )}
                      </div>

                      <p className="mt-1 break-all text-xs text-[#07152F]/45">
                        ID: {account.id}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleStyles[account.role]}`}
                        >
                          {roleLabels[account.role]}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-[#07152F]/45">
                        Registered{" "}
                        {new Date(account.created_at).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label htmlFor={`role-${account.id}`} className="sr-only">
                      Role for {name}
                    </label>

                    <select
                      id={`role-${account.id}`}
                      value={selectedRoles[account.id] ?? account.role}
                      disabled={isSelf || isSaving || savingId !== null}
                      onChange={(event) => {
                        const role = event.target.value as AccountRole;
                        setSelectedRoles((current) => ({
                          ...current,
                          [account.id]: role,
                        }));
                        setError("");
                      }}
                      className="min-w-44 rounded-xl border border-[#07152F]/15 bg-white px-3 py-2.5 text-sm text-[#07152F] outline-none focus:border-[#D6B45A] focus:ring-2 focus:ring-[#D6B45A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Administrator</option>
                      <option value="super_admin">Super Admin</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => requestRoleChange(account)}
                      disabled={
                        isSelf ||
                        isSaving ||
                        savingId !== null ||
                        selectedRoles[account.id] === account.role
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07152F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#10264B] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {isSaving && (
                        <LoaderCircle size={16} className="animate-spin" />
                      )}
                      {isSaving ? "Saving..." : "Save role"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-[#07152F]/50">
        Role changes affect access to the administration workspace. Confirm the
        identity of an account before granting elevated privileges.
      </p>

      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07152F]/55 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!savingId) setConfirmation(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-confirmation-title"
            className="w-full max-w-md rounded-2xl border border-[#07152F]/10 bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <ShieldCheck size={22} />
              </div>
              <button
                type="button"
                aria-label="Close confirmation"
                onClick={() => setConfirmation(null)}
                disabled={savingId !== null}
                className="rounded-lg p-2 text-[#07152F]/50 transition hover:bg-slate-100 hover:text-[#07152F] disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <h2
              id="role-confirmation-title"
              className="mt-4 text-xl font-semibold text-[#07152F]"
            >
              Confirm role change
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#07152F]/65">
              Change <span className="font-semibold">{confirmationName}</span>
              ’s role to{" "}
              <span className="font-semibold">
                {roleLabels[confirmation.nextRole]}
              </span>
              ? This will change the access available to this account.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                disabled={savingId !== null}
                className="rounded-xl border border-[#07152F]/15 px-4 py-2.5 text-sm font-medium text-[#07152F] transition hover:bg-[#07152F]/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmRoleChange()}
                disabled={savingId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07152F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#10264B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingId !== null && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {savingId !== null ? "Saving..." : "Confirm change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#07152F]/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#07152F]/60">{label}</p>
        <span className="rounded-xl bg-[#07152F]/5 p-2 text-[#07152F]">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-[#07152F]">
        {value}
      </p>
    </div>
  );
}
