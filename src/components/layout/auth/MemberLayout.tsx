import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Cake,
  CircleUserRound,
  HandCoins,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { useAuth } from "../auth/AuthProvider";

const memberNavigation = [
  {
    label: "Overview",
    to: "/member",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    to: "/member/profile",
    icon: CircleUserRound,
  },
  {
    label: "Birthday",
    to: "/member/birthday",
    icon: Cake,
  },
  {
    label: "Cooperative",
    to: "/member/cooperative",
    icon: HandCoins,
  },
];

export default function MemberLayout() {
  const location = useLocation();
  const { profile, signOut, isAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const displayName = profile?.first_name || profile?.last_name || "Member";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Unable to sign out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#07152F]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/member" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#07152F] text-sm font-semibold text-[#E2BD61]">
              P
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#07152F]">
                The Pavilion
              </p>

              <p className="text-xs text-[#07152F]/55">Member Area</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#07152F]/65 sm:block">
              Welcome, {displayName}
            </span>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden rounded-full border border-[#D6B45A]/50 px-4 py-2 text-sm font-medium text-[#07152F] transition hover:bg-[#D6B45A]/10 sm:inline-flex"
              >
                Admin Dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-[#07152F]/10 px-3 py-2 text-sm font-medium text-[#07152F] transition hover:border-[#07152F]/20 hover:bg-[#07152F]/5"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-[#07152F]/10 bg-white lg:block">
          <div className="sticky top-16 p-5">
            <div className="mb-6 rounded-2xl bg-[#07152F] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E2BD61]">
                My Pavilion
              </p>

              <p className="mt-2 text-lg font-semibold">{displayName}</p>

              <p className="mt-1 text-xs text-white/60">
                {profile?.membership_status === "approved"
                  ? "Approved member"
                  : "Membership pending"}
              </p>
            </div>

            <nav className="space-y-1">
              {memberNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/member"}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-[#07152F] text-white"
                          : "text-[#07152F]/70 hover:bg-[#07152F]/5 hover:text-[#07152F]",
                      ].join(" ")
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-b border-[#07152F]/10 bg-white lg:hidden">
            <div className="flex gap-2 overflow-x-auto px-5 py-3">
              {memberNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/member"}
                    className={({ isActive }) =>
                      [
                        "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-[#07152F] text-white"
                          : "bg-[#07152F]/5 text-[#07152F]/70",
                      ].join(" ")
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="min-h-[calc(100vh-4rem)] p-5 sm:p-8 lg:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
