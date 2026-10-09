import { useEffect, useState } from "react";
import { CheckCircle2, MailCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { supabase } from "../../lib/supabase";

export default function VerifyEmail() {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);

  const email = location.state?.email as string | undefined;

  useEffect(() => {
    let mounted = true;

    const checkVerification = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user?.email_confirmed_at) {
        setVerified(true);
      }

      setChecking(false);
    };

    checkVerification();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        setVerified(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#07152F]/5">
          <MailCheck size={26} className="text-[#D6B45A]" />
        </div>

        <h1 className="font-serif text-3xl text-[#07152F]">
          Checking your email...
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#07152F]/60">
          Please wait while we confirm your account.
        </p>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>

        <h1 className="mt-6 font-serif text-3xl text-[#07152F]">
          Email verified
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#07152F]/60">
          Your email address has been successfully verified. You can now sign in
          to your Pavilion account.
        </p>

        <Link
          to="/sign-in"
          className="mt-8 inline-flex rounded-full bg-[#07152F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2148]"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D6B45A]/10">
        <MailCheck size={32} className="text-[#D6B45A]" />
      </div>

      <h1 className="mt-6 font-serif text-3xl text-[#07152F]">
        Check your email
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#07152F]/60">
        We sent a confirmation link
        {email ? ` to ${email}` : ""}. Open the email and click the confirmation
        button to activate your account.
      </p>

      <div className="mt-8 rounded-2xl border border-[#07152F]/10 bg-white p-5 text-left">
        <p className="text-sm font-semibold text-[#07152F]">
          Didn't receive the email?
        </p>

        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#07152F]/60">
          <li>• Check your spam or junk folder.</li>
          <li>• Make sure you entered the correct email address.</li>
          <li>• Wait a few minutes and try again.</li>
        </ul>
      </div>

      <Link
        to="/sign-in"
        className="mt-8 inline-flex text-sm font-medium text-[#07152F] underline underline-offset-4 transition hover:text-[#D6B45A]"
      >
        Back to sign in
      </Link>
    </div>
  );
}
