import { Cake, CalendarDays, HandCoins, Mail, Users } from "lucide-react";
import { Link } from "react-router-dom";

const adminSections = [
  {
    title: "Members",
    description: "Review and manage church member accounts.",
    icon: Users,
    to: "/admin/members",
  },
  {
    title: "Birthday submissions",
    description: "Review birthdays, view photos and manage celebrations.",
    icon: Cake,
    to: "/admin/birthdays",
  },
  {
    title: "Events",
    description: "Manage church programmes and upcoming events.",
    icon: CalendarDays,
    to: "/admin/events",
  },
  {
    title: "Contact Messages",
    description:
      "View and manage messages submitted through the church website.",
    icon: Mail,
    to: "/admin/messages",
  },
  {
    title: "Cooperative Interest",
    description: "Review and manage members' cooperative interest submissions.",
    icon: HandCoins,
    to: "/admin/cooperative",
  },
];

export default function AdminDashboard() {
  return (
    <section>
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D6B45A]">
          Administration
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#07152F] sm:text-4xl">
          Admin Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#07152F]/65">
          Manage member services and church information for The Pavilion of His
          Majesty.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.title}
              to={section.to}
              className="group rounded-2xl border border-[#07152F]/10 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#D6B45A]/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B45A]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D6B45A]/10 transition group-hover:bg-[#D6B45A]/20">
                <Icon size={24} className="text-[#D6B45A]" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-[#07152F]">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#07152F]/60">
                {section.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#07152F]">
                Open section
                <span
                  aria-hidden="true"
                  className="transition group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
