import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Cake,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import logo from "../../assets/images/pavilion-logo.png";
import { useAuth } from "../layout/auth/AuthProvider";

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
  const [memberOpen, setMemberOpen] = useState(false);

  const { isAuthenticated, profile, isAdmin, signOut } = useAuth();

  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMoreOpen(false);
    setMemberOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      closeMobileMenu();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
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
              onClick={() => {
                setMoreOpen((open) => !open);
                setMemberOpen(false);
              }}
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

          {/* Member Access / My Pavilion */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMemberOpen((open) => !open);
                  setMoreOpen(false);
                }}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-[#d6b45a]/60 hover:text-[#e2bd61]"
                aria-expanded={memberOpen}
                aria-haspopup="menu"
              >
                <CircleUserRound size={17} />

                <span>My Pavilion</span>

                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    memberOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {memberOpen && (
                <div className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-[#07152f]/10 bg-white p-2 text-[#07152f] shadow-2xl">
                  {/* Account header */}
                  <div className="border-b border-[#07152f]/10 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#07152f]/45">
                      My Pavilion
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {profile?.first_name || "Member"}
                    </p>

                    <p className="mt-1 text-xs capitalize text-[#07152f]/50">
                      {profile?.membership_status || "Member"}
                    </p>
                  </div>

                  {/* Member Area */}
                  <Link
                    to="/member"
                    onClick={() => setMemberOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-[#07152f]/5"
                  >
                    <CircleUserRound size={17} />
                    Member Area
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/member/profile"
                    onClick={() => setMemberOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-[#07152f]/5"
                  >
                    <CircleUserRound size={17} />
                    My Profile
                  </Link>

                  {/* Birthday */}
                  <Link
                    to="/member/birthday"
                    onClick={() => setMemberOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-[#07152f]/5"
                  >
                    <Cake size={17} />
                    Birthday
                  </Link>

                  {/* Cooperative */}
                  <Link
                    to="/member/cooperative"
                    onClick={() => setMemberOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-[#07152f]/5"
                  >
                    <CircleUserRound size={17} />
                    Cooperative
                  </Link>

                  {/* Admin */}
                  {isAdmin && (
                    <>
                      <div className="my-1 border-t border-[#07152f]/10" />

                      <Link
                        to="/admin"
                        onClick={() => setMemberOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#07152f] transition hover:bg-[#d6b45a]/10"
                      >
                        <LayoutDashboard size={17} />
                        Admin Dashboard
                      </Link>
                    </>
                  )}

                  <div className="my-1 border-t border-[#07152f]/10" />

                  {/* Sign out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-[#d6b45a]/60 hover:text-[#e2bd61]"
            >
              <CircleUserRound size={17} />
              Member Access
            </Link>
          )}

          {/* Give CTA */}
          <NavLink
            to="/give"
            className="whitespace-nowrap rounded-full bg-[#d6b45a] px-5 py-2.5 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
          >
            Give
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

            {/* Member section */}
            <div className="mt-4 border-t border-white/10 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="mb-2 px-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e2bd61]">
                      My Pavilion
                    </p>

                    <p className="mt-1 text-xs text-white/45">
                      {profile?.first_name || "Member"}
                    </p>
                  </div>

                  <Link
                    to="/member"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                  >
                    <CircleUserRound size={18} />
                    Member Area
                  </Link>

                  <Link
                    to="/member/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                  >
                    <CircleUserRound size={18} />
                    My Profile
                  </Link>

                  <Link
                    to="/member/birthday"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                  >
                    <Cake size={18} />
                    Birthday
                  </Link>

                  <Link
                    to="/member/cooperative"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                  >
                    Cooperative
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#e2bd61] transition hover:bg-white/5"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-300 transition hover:bg-white/5"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#d6b45a]/40 px-4 py-3 text-sm font-medium text-[#e2bd61]"
                >
                  <CircleUserRound size={18} />
                  Member Access
                </Link>
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
          </nav>
        </div>
      )}
    </header>
  );
}
