import { Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import churchBuilding from "../../../assets/images/church-building.png";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#111827]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Visual panel */}
        <section className="relative hidden overflow-hidden bg-[#07152F] lg:block">
          <img
            src={churchBuilding}
            alt="The Pavilion of His Majesty"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-[#07152F]/80" />

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 xl:p-14">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 text-sm text-white/80 transition hover:text-[#E2BD61]"
            >
              <ArrowLeft size={17} />
              Back to website
            </Link>

            <div className="max-w-xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#E2BD61]">
                The Pavilion of His Majesty
              </p>

              <h1 className="font-serif text-4xl leading-tight text-white xl:text-5xl">
                A place of His presence.
                <br />A people of His purpose.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
                Access your Pavilion account to connect with member features,
                church programmes, birthday celebrations, cooperative services,
                and more.
              </p>
            </div>

            <p className="text-sm text-white/50">
              The Redeemed Christian Church of God
            </p>
          </div>
        </section>

        {/* Form panel */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-[#07152F]/70 transition hover:text-[#07152F]"
              >
                <ArrowLeft size={17} />
                Back to website
              </Link>
            </div>

            <div className="mb-8 lg:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B45A]">
                The Pavilion of His Majesty
              </p>
            </div>

            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
