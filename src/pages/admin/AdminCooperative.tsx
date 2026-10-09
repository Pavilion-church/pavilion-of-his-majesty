import { useEffect, useState } from "react";
import {
  Search,
  Users,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type CooperativeInterestRecord = {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  created_at: string;
};

export default function AdminCooperative() {
  const [records, setRecords] = useState<CooperativeInterestRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRecords() {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("cooperative_interest")
      .select(
        "id, user_id, first_name, last_name, email, phone, message, created_at",
      )
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Unable to load cooperative interest:", queryError);
      setError(
        "We couldn't load cooperative interest records. Check your admin access and database policies.",
      );
      setRecords([]);
    } else {
      setRecords((data ?? []) as CooperativeInterestRecord[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const text = [
      record.first_name,
      record.last_name,
      record.email,
      record.phone,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.trim().toLowerCase());
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a68f64]">
            Cooperative
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#07152f]">
            Expressions of Interest
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            View members who have expressed interest in the Pavilion
            Cooperative.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadRecords()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#07152f]/15 px-4 py-2.5 text-sm font-medium text-[#07152f] hover:bg-[#07152f]/5 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total expressions of interest
            </p>
            <Users size={20} className="text-[#a68f64]" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-[#07152f]">
            {records.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-600">Purpose</p>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            Collect interest and contact prospective participants for further
            information.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d6b45a]"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">
            Loading cooperative interest records...
          </p>
        ) : !error && filteredRecords.length === 0 ? (
          <div className="py-14 text-center">
            <Users size={30} className="mx-auto text-gray-400" />
            <p className="mt-4 font-medium text-[#07152f]">
              {search
                ? "No matching records"
                : "No expressions of interest yet"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try another name, email address or phone number."
                : "Submissions will appear here when members register their interest."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-[#07152f]">
                      {[record.first_name, record.last_name]
                        .filter(Boolean)
                        .join(" ") || "Name not provided"}
                    </h2>

                    <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
                      {record.email && (
                        <a
                          href={`mailto:${record.email}`}
                          className="flex items-center gap-2 break-all hover:text-[#a68f64]"
                        >
                          <Mail size={15} />
                          {record.email}
                        </a>
                      )}

                      {record.phone && (
                        <a
                          href={`tel:${record.phone}`}
                          className="flex items-center gap-2 hover:text-[#a68f64]"
                        >
                          <Phone size={15} />
                          {record.phone}
                        </a>
                      )}

                      <p className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        Submitted{" "}
                        {new Date(record.created_at).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                    Interested
                  </span>
                </div>

                {record.message && (
                  <div className="mt-5 rounded-lg bg-[#f8f6f1] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Message
                    </p>
                    <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-700">
                      {record.message}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
