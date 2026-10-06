import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

import { churchInfo } from "../../assets/data";

export default function Footer() {
  return (
    <footer className="bg-[#07152f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Church identity */}
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              The Pavilion of His Majesty
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/65">
              The Redeemed Christian Church of God
            </p>

            <p className="mt-4 text-sm italic leading-6 text-[#d6b45a]">
              A Place of His Presence. A People of His Purpose.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6b45a]">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
              <Link className="transition hover:text-white" to="/about">
                About Us
              </Link>

              <Link className="transition hover:text-white" to="/ministries">
                Ministries
              </Link>

              <Link className="transition hover:text-white" to="/events">
                Events
              </Link>

              <Link className="transition hover:text-white" to="/get-involved">
                Get Involved
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6b45a]">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
              <Link
                className="transition hover:text-white"
                to="/plan-your-visit"
              >
                Plan Your Visit
              </Link>

              <Link className="transition hover:text-white" to="/cooperative">
                Cooperative
              </Link>

              <Link className="transition hover:text-white" to="/give">
                Give
              </Link>

              <Link className="transition hover:text-white" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6b45a]">
              Connect
            </h3>

            <div className="mt-5 space-y-4 text-sm text-white/70">
              {/* Email */}
              <a
                href={`mailto:${churchInfo.contact.email}`}
                className="flex items-start gap-3 transition hover:text-white"
              >
                <Mail size={18} className="mt-0.5 shrink-0" />

                <span className="break-all">{churchInfo.contact.email}</span>
              </a>

              {/* Phone */}
              <a
                href={`tel:${churchInfo.contact.pastorPhone.replace(
                  /\s/g,
                  "",
                )}`}
                className="flex items-start gap-3 transition hover:text-white"
              >
                <Phone size={18} className="mt-0.5 shrink-0" />

                <span>{churchInfo.contact.pastorPhone}</span>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0" />

                <span>
                  {churchInfo.address.street},
                  <br />
                  {churchInfo.address.city}, {churchInfo.address.state}
                </span>
              </div>
            </div>

            {/* Social media */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                Follow Us
              </p>

              <div className="mt-4 flex gap-3">
                {/* Instagram */}
                <a
                  href={churchInfo.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow The Pavilion of His Majesty on Instagram"
                  className="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-white/15 transition hover:border-[#d6b45a] hover:text-[#d6b45a]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4.75 w-4.75"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />

                    <circle cx="12" cy="12" r="4" />

                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href={churchInfo.social.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow The Pavilion of His Majesty on TikTok"
                  className="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-white/15 transition hover:border-[#d6b45a] hover:text-[#d6b45a]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4.5 w-4.5"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.26V2h-3.45v13.67a2.9 2.9 0 1 1-2.9-2.9c.3 0 .59.03.87.12V9.38a6.4 6.4 0 0 0-.87-.06A6.35 6.35 0 1 0 15.82 15V8.76a8.22 8.22 0 0 0 4.79 1.52V6.84a4.9 4.9 0 0 1-1.02-.15Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © {new Date().getFullYear()} The Pavilion of His Majesty. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
