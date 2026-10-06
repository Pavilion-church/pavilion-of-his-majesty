import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

import logo from "../../assets/images/pavilion-logo.png";

const mainNavigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ministries", to: "/ministries" },
  { label: "Events", to: "/events" },
  { label: "Get Involved", to: "/get-involved" },
];

const moreNavigation = [
  { label: "Cooperative", to: "/cooperative" },
  { label: "Plan Your Visit", to: "/plan-your-visit" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07152f]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src={logo}
            alt="The Pavilion of His Majesty"
            className="h-14 w-14 object-contain"
          />

          <div className="hidden sm:block">
            <p className="font-serif text-sm font-semibold tracking-wide text-white">
              The Pavilion
            </p>

            <p className="text-xs tracking-[0.18em] text-[#d6b45a]">
              OF HIS MAJESTY
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-5 lg:flex">
          {/* Main navigation */}
          {mainNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-[#e2bd61]"
                    : "text-white/80 hover:text-[#e2bd61]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              className="flex items-center gap-1 whitespace-nowrap text-sm text-white/80 transition-colors hover:text-[#e2bd61]"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              More
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#07152f] py-2 shadow-2xl">
                {moreNavigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `block px-5 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-white/5 font-semibold text-[#e2bd61]"
                          : "text-white/80 hover:bg-white/5 hover:text-[#e2bd61]"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Give CTA */}
          <NavLink
            to="/give"
            className="whitespace-nowrap rounded-full bg-[#d6b45a] px-5 py-2.5 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
          >
            Give
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `whitespace-nowrap text-sm transition-colors ${
                isActive
                  ? "font-semibold text-[#e2bd61]"
                  : "text-white/80 hover:text-[#e2bd61]"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-md p-2 text-white transition hover:bg-white/10 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#07152f] lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {/* Main navigation */}
            {mainNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `border-b border-white/10 px-2 py-4 text-sm transition-colors ${
                    isActive
                      ? "font-semibold text-[#e2bd61]"
                      : "text-white/85 hover:text-[#e2bd61]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* More section */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setMoreOpen((open) => !open)}
                className="flex w-full items-center justify-between px-2 py-4 text-left text-sm text-white/85 transition-colors hover:text-[#e2bd61]"
                aria-expanded={moreOpen}
              >
                <span>More</span>

                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {moreOpen && (
                <div className="pb-2 pl-4">
                  {moreNavigation.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `block border-l border-white/10 px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? "border-[#d6b45a] font-semibold text-[#e2bd61]"
                            : "text-white/65 hover:text-[#e2bd61]"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Give CTA */}
            <NavLink
              to="/give"
              onClick={closeMobileMenu}
              className="mt-4 rounded-full bg-[#d6b45a] px-5 py-3 text-center text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
            >
              Give
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `border-b border-white/10 px-2 py-4 text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-[#e2bd61]"
                    : "text-white/85 hover:text-[#e2bd61]"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
