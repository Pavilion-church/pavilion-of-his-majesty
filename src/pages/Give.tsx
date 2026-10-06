import { Copy, Heart, Mail, MapPin } from "lucide-react";
import { givingInfo, churchInfo } from "../assets/data";

export default function Give() {
  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText(givingInfo.accountNumber);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#07152f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d6b45a]">
              Giving
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Give with a<span className="text-[#e2bd61]"> willing heart.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Your giving helps support the work of the church, ministry and the
              people we are called to serve.
            </p>
          </div>
        </div>
      </section>

      {/* Giving message */}
      <section className="bg-[#f8f6f1]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-28">
          <div>
            <Heart size={28} className="text-[#d6b45a]" />

            <h2 className="mt-6 font-serif text-3xl font-semibold text-[#07152f] sm:text-4xl">
              Thank you for supporting the work of God.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#4b5563]">
              We are grateful for every gift given towards the work and ministry
              of The Pavilion of His Majesty. Give as you are led and according
              to your conviction.
            </p>
          </div>

          {/* Bank details */}
          <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-[#07152f]/10 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a68f64]">
              Official Bank Details
            </p>

            <div className="mt-7 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">
                  Bank
                </p>
                <p className="mt-1 text-lg font-semibold text-[#07152f]">
                  {givingInfo.bankName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">
                  Account Name
                </p>
                <p className="mt-1 text-lg font-semibold text-[#07152f]">
                  {givingInfo.accountName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">
                  Account Number
                </p>

                <div className="mt-1 flex items-center justify-between gap-4">
                  <p className="text-2xl font-semibold tracking-wide text-[#07152f]">
                    {givingInfo.accountNumber}
                  </p>

                  <button
                    type="button"
                    onClick={copyAccountNumber}
                    className="rounded-full border border-[#07152f]/10 p-3 text-[#07152f] transition hover:border-[#d6b45a] hover:text-[#a68f64]"
                    aria-label="Copy account number"
                    title="Copy account number"
                  >
                    <Copy size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#07152f]/10 pt-6">
              <p className="text-sm leading-7 text-[#6b7280]">
                {givingInfo.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other giving / contact information */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#07152f]/10 p-7">
              <MapPin size={22} className="text-[#d6b45a]" />

              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#07152f]">
                Visit the church
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                {churchInfo.address.full}
              </p>
            </div>

            <div className="rounded-2xl border border-[#07152f]/10 p-7">
              <Mail size={22} className="text-[#d6b45a]" />

              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#07152f]">
                Need help?
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                If you have questions about giving or need to confirm any
                information, please contact the church directly.
              </p>

              <a
                href={`mailto:${churchInfo.contact.email}`}
                className="mt-4 inline-block text-sm font-semibold text-[#07152f] hover:text-[#a68f64]"
              >
                {churchInfo.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-[#07152f]">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="font-serif text-2xl italic leading-9 text-white/90 sm:text-3xl">
            “God loves a cheerful giver.”
          </p>

          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[#d6b45a]">
            2 Corinthians 9:7
          </p>
        </div>
      </section>
    </div>
  );
}
