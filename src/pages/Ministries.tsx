import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ministries } from "../assets/data";

export default function Ministries() {
  return (
    <div className="bg-[#f8f6f1] text-[#111827]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07152f] text-white">
        <div className="absolute inset-0">
          <img
            src={ministries[0].image}
            alt=""
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[#07152f]/85" />
          <div className="absolute inset-0 bg-linear-to-r from-[#07152f] via-[#07152f]/90 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-[#e2bd61]">
              <span className="h-px w-10 bg-[#d6b45a]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                Serve • Grow • Belong
              </span>
            </div>

            <h1 className="font-serif text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Serving God
              <span className="block text-[#e2bd61]">Together.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              There is a place for everyone to serve, grow and make a
              difference. Discover the ministries that help make up the life and
              community of The Pavilion of His Majesty.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-[#b18a32]">
                <Heart size={18} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Our Community
                </span>
              </div>

              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-[#07152f] sm:text-5xl">
                More than a place to worship.
              </h2>
            </div>

            <div className="max-w-2xl lg:ml-auto">
              <p className="text-base leading-8 text-gray-600 sm:text-lg">
                Church is a family, and every person has something meaningful to
                contribute. Our ministries provide opportunities to serve
                others, develop your gifts and build meaningful relationships
                while growing in Christ.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[#07152f]">
                <Sparkles size={18} className="text-[#c29b42]" />
                Find a place where you can serve with purpose.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MINISTRY GRID */}
      <section className="bg-[#f8f6f1]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b18a32]">
                Find Your Place
              </p>

              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#07152f] sm:text-5xl">
                Our Ministries
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-500">
              Different roles, one purpose — serving God and building His
              people.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ministries.map((ministry, index) => (
              <article
                key={ministry.id}
                className={`group overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  index === 0 ? "xl:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 ? "aspect-16/8" : "aspect-16/10"
                  }`}
                >
                  <img
                    src={ministry.image}
                    alt={ministry.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-[#07152f]/80 via-[#07152f]/10 to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <span className="inline-flex bg-[#07152f]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e2bd61] backdrop-blur-sm">
                      Ministry
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl font-semibold text-[#07152f]">
                      {ministry.name}
                    </h3>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#07152f]/10 transition group-hover:border-[#d6b45a] group-hover:bg-[#07152f] group-hover:text-[#e2bd61]">
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-gray-600">
                    {ministry.description}
                  </p>

                  {ministry.highlight && (
                    <div className="mt-5 border-l-2 border-[#d6b45a] bg-[#f8f6f1] px-4 py-3">
                      <p className="text-xs font-semibold leading-5 text-[#07152f]">
                        {ministry.highlight}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#b18a32] transition group-hover:text-[#07152f]">
                    Learn more
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE CTA */}
      <section className="bg-[#07152f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden border border-white/10 bg-white/3 px-6 py-12 sm:px-10 lg:px-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d6b45a]/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b45a]">
                  Ready to get involved?
                </p>

                <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                  There is a place for you here.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base">
                  Whether you are new to the church or have been with us for
                  years, we would love to help you find a place to connect and
                  serve.
                </p>
              </div>

              <Link
                to="/get-involved"
                className="inline-flex shrink-0 items-center justify-center gap-3 bg-[#d6b45a] px-7 py-4 text-sm font-semibold text-[#07152f] transition hover:bg-[#e2bd61]"
              >
                Get Involved
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
