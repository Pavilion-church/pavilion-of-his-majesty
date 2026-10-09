import { Cake, CalendarDays, Users, Megaphone } from "lucide-react";

const adminSections = [
  {
    title: "Members",
    description: "Review and manage church member accounts.",
    icon: Users,
  },
  {
    title: "Birthday submissions",
    description: "Review birthdays, view photos and manage celebrations.",
    icon: Cake,
  },
  {
    title: "Events",
    description: "Manage church programmes and upcoming events.",
    icon: CalendarDays,
  },
  {
    title: "Announcements",
    description: "Publish important updates for the congregation.",
    icon: Megaphone,
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

      <div className="grid gap-5 sm:grid-cols-2">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.title}
              className="rounded-2xl border border-[#07152F]/10 bg-white p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D6B45A]/10">
                <Icon size={24} className="text-[#D6B45A]" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-[#07152F]">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#07152F]/60">
                {section.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
