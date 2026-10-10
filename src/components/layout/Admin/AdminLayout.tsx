import {
  Cake,
  CalendarDays,
  LayoutDashboard,
  Mail,
  LogOut,
  Megaphone,
  ShieldCheck,
  Users,
  House,
  HandCoins,
} from "lucide-react";
import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

const navigation = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Birthday management", to: "/admin/birthdays", icon: Cake },
  { label: "Contact messages", to: "/admin/messages", icon: Mail },
  { label: "Members", to: "/admin/members", icon: Users },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
  {
    label: "Cooperative Interest",
    to: "/admin/cooperative",
    icon: HandCoins,
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const { profile, signOut, isSuperAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error("Unable to sign out:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#07152F]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/admin" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#07152F] text-[#E2BD61]">
              <ShieldCheck size={23} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#07152F]">
                Pavilion Administration
              </p>
              <p className="text-xs text-[#07152F]/50">
                Church management workspace
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[#07152F]">
                {profile?.first_name || "Administrator"}
              </p>
              <p className="text-xs text-[#07152F]/50">
                {isSuperAdmin ? "Super administrator" : "Administrator"}
              </p>
            </div>

            <Link
              to="/"
              aria-label="Go to public home page"
              title="Go to Home"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#07152F]/10 px-3 py-2.5 text-sm font-medium text-[#07152F] transition hover:border-[#D6B45A]/70 hover:bg-[#F8F6F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B45A]"
            >
              <House size={16} />
              <span className="hidden sm:inline">Go to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#07152F]/10 px-3 py-2.5 text-sm font-medium text-[#07152F] transition hover:bg-[#07152F]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B45A]"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#07152F]/10 bg-white lg:block">
          <div className="sticky top-18 flex h-[calc(100vh-72px)] flex-col p-5">
            <div className="mb-7 rounded-2xl bg-[#07152F] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E2BD61]">
                The Pavilion
              </p>
              <h2 className="mt-3 font-serif text-xl">Administration</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Manage members, celebrations and church communications.
              </p>
            </div>

            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#07152F]/40">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-[#07152F] text-white shadow-sm"
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
            <nav className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition",
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
            </nav>
          </div>

          <div className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-10 xl:p-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
