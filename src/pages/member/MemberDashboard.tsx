import { Cake, CircleUserRound, HandCoins } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../components/layout/auth/AuthProvider";

export default function MemberDashboard() {
  const { profile } = useAuth();

  const firstName = profile?.first_name || "Member";

  return (
    <section>
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D6B45A]">
          My Pavilion
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
          Welcome, {firstName}.
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-[#07152F]/65">
          Your private Pavilion member space. Manage your profile, birthday
          information and access member services from here.
        </p>
      </div>

      {profile?.membership_status !== "approved" && (
        <div className="mb-8 rounded-2xl border border-[#D6B45A]/40 bg-[#D6B45A]/10 p-5">
          <p className="font-semibold text-[#07152F]">
            Membership approval pending
          </p>

          <p className="mt-1 text-sm leading-6 text-[#07152F]/70">
            Your account has been created successfully. Some Pavilion services
            may remain unavailable until your membership is approved by the
            church.
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        <Link
          to="/member/profile"
          className="group rounded-2xl border border-[#07152F]/10 bg-white p-6 transition hover:-translate-y-1 hover:border-[#D6B45A]/50 hover:shadow-lg"
        >
          <CircleUserRound size={28} className="text-[#D6B45A]" />

          <h2 className="mt-5 text-lg font-semibold text-[#07152F]">
            My Profile
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#07152F]/60">
            View and manage your member information.
          </p>
        </Link>

        <Link
          to="/member/birthday"
          className="group rounded-2xl border border-[#07152F]/10 bg-white p-6 transition hover:-translate-y-1 hover:border-[#D6B45A]/50 hover:shadow-lg"
        >
          <Cake size={28} className="text-[#D6B45A]" />

          <h2 className="mt-5 text-lg font-semibold text-[#07152F]">
            Birthday
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#07152F]/60">
            Submit or update your birthday information privately.
          </p>
        </Link>

        <Link
          to="/member/cooperative"
          className="group rounded-2xl border border-[#07152F]/10 bg-white p-6 transition hover:-translate-y-1 hover:border-[#D6B45A]/50 hover:shadow-lg"
        >
          <HandCoins size={28} className="text-[#D6B45A]" />

          <h2 className="mt-5 text-lg font-semibold text-[#07152F]">
            Cooperative
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#07152F]/60">
            Access cooperative services available to eligible members.
          </p>
        </Link>
      </div>
    </section>
  );
}
