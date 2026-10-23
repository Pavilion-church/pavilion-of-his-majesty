import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, HandCoins, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../components/layout/auth/AuthProvider";
import { supabase } from "../../lib/supabase";

export default function Cooperative() {
  const { profile } = useAuth();
  const isApprovedMember = profile?.membership_status === "approved";
  const userId = profile?.id;

  const [hasRegisteredInterest, setHasRegisteredInterest] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  const checkInterest = useCallback(async () => {
    if (!userId || !isApprovedMember) {
      setHasRegisteredInterest(false);
      setIsChecking(false);
      setLoadError("");
      return;
    }

    setIsChecking(true);
    setLoadError("");

    const { data, error } = await supabase
      .from("cooperative_interest")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Unable to check cooperative interest:", error);
      setLoadError(
        "We couldn't check your cooperative registration right now. Please try again.",
      );
    } else {
      setHasRegisteredInterest(Boolean(data));
    }

    setIsChecking(false);
  }, [userId, isApprovedMember]);

  useEffect(() => {
    void checkInterest();
  }, [checkInterest]);

  const registerInterest = async () => {
    if (!userId || !isApprovedMember || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        toast.error(
          "Your session could not be verified. Please sign in again and retry.",
        );
        return;
      }

      const user = authData.user;
      const firstName =
        typeof profile?.first_name === "string"
          ? profile.first_name.trim()
          : "";
      const lastName =
        typeof profile?.last_name === "string" ? profile.last_name.trim() : "";
      const phone =
        typeof profile?.phone === "string" ? profile.phone.trim() : "";

      const { error } = await supabase.from("cooperative_interest").insert({
        user_id: user.id,
        first_name: firstName || null,
        last_name: lastName || null,
        email: user.email?.trim().toLowerCase() || null,
        phone: phone || null,
        message: null,
      });

      if (error) {
        if (error.code === "23505") {
          setHasRegisteredInterest(true);
          toast.success("Your cooperative interest is already registered.");
        } else if (error.code === "42501") {
          toast.error(
            "Your membership may still be awaiting approval. Cooperative interest registration is available after your membership is approved.",
          );
        } else {
          console.error("Unable to register cooperative interest:", error);
          toast.error(
            "We couldn't register your interest right now. Please try again.",
          );
        }
        return;
      }

      setHasRegisteredInterest(true);
      toast.success("Your cooperative interest has been registered.");
    } catch (error) {
      console.error("Unexpected cooperative registration error:", error);
      toast.error(
        "Something went wrong while registering your interest. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D6B45A]">
        Cooperative
      </p>
      <h1 className="mt-3 font-serif text-3xl text-[#07152F]">
        Member Cooperative
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#07152F]/65">
        Learn about cooperative participation and register your interest when
        your church membership has been approved.
      </p>

      <div className="mt-8 rounded-2xl border border-[#07152F]/10 bg-white p-6 sm:p-8">
        {!isApprovedMember ? (
          <div>
            <h2 className="font-semibold text-[#07152F]">
              Membership approval required
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#07152F]/65">
              Cooperative interest registration is available to members whose
              Pavilion membership has been approved. Once your membership is
              approved, return here to register your interest.
            </p>
          </div>
        ) : isChecking ? (
          <div className="flex items-center gap-3 text-sm text-[#07152F]/65">
            <LoaderCircle size={20} className="animate-spin" /> Checking your
            cooperative registration...
          </div>
        ) : loadError ? (
          <div>
            <p role="alert" className="text-sm leading-7 text-red-700">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void checkInterest()}
              className="mt-4 rounded-xl bg-[#07152F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10254A]"
            >
              Try again
            </button>
          </div>
        ) : hasRegisteredInterest ? (
          <div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={26} className="shrink-0 text-green-700" />
              <h2 className="font-semibold text-[#07152F]">
                Interest registered
              </h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#07152F]/65">
              Your interest in the Pavilion Cooperative has been recorded. This
              registration expresses your interest in participating; it does not
              by itself confirm cooperative admission or membership.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <HandCoins size={28} className="shrink-0 text-[#D6B45A]" />
              <h2 className="font-semibold text-[#07152F]">
                Register your interest
              </h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#07152F]/65">
              Your church membership is approved. You can now register your
              interest in the Pavilion Cooperative. The church can follow up
              with further information about participation.
            </p>
            <button
              type="button"
              onClick={() => void registerInterest()}
              disabled={isSubmitting}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#07152F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10254A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />{" "}
                  Registering...
                </>
              ) : (
                "Register my interest"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
