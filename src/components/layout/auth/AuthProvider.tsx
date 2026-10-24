import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../../../lib/supabase";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: "member" | "admin" | "super_admin";
  membership_status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isApprovedMember: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Prevent old profile requests from overwriting newer authentication state.
  const profileRequestId = useRef(0);

  // Prevent initial session retrieval from overwriting a newer auth event.
  const authEventId = useRef(0);

  const user = session?.user ?? null;

  const loadProfile = useCallback(async (userId: string) => {
    const requestId = ++profileRequestId.current;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
            id,
            first_name,
            last_name,
            phone,
            role,
            membership_status,
            created_at,
            updated_at
          `,
        )
        .eq("id", userId)
        .maybeSingle();

      if (requestId !== profileRequestId.current) return;

      if (error) {
        console.error("Unable to load profile:", error);
        setProfile(null);
        return;
      }

      setProfile(data as Profile | null);
    } catch (error) {
      if (requestId !== profileRequestId.current) return;

      console.error("Unexpected error loading profile:", error);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      ++profileRequestId.current;
      setProfile(null);
      return;
    }

    await loadProfile(user.id);
  }, [user, loadProfile]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error);
      throw error;
    }

    // Invalidate pending profile requests immediately.
    ++profileRequestId.current;
    setSession(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      // Mark this event as newer than any pending initial session lookup.
      ++authEventId.current;

      setSession(newSession);

      if (!newSession?.user) {
        ++profileRequestId.current;
        setProfile(null);
        setLoading(false);
        return;
      }

      // Finish the synchronous auth callback before querying Supabase again.
      // This helps avoid auth-lock/deadlock issues.
      Promise.resolve().then(async () => {
        if (!mounted) return;

        await loadProfile(newSession.user.id);

        if (mounted) {
          setLoading(false);
        }
      });
    });

    const initializeAuth = async () => {
      const initialAuthEventId = authEventId.current;

      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Unable to initialise authentication:", error);
        }

        // A newer sign-in/sign-out event has already arrived.
        if (initialAuthEventId !== authEventId.current) return;

        setSession(currentSession);

        if (currentSession?.user) {
          await loadProfile(currentSession.user.id);
        } else {
          ++profileRequestId.current;
          setProfile(null);
        }
      } catch (error) {
        if (!mounted) return;

        console.error("Authentication initialisation failed:", error);

        if (initialAuthEventId === authEventId.current) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mounted && initialAuthEventId === authEventId.current) {
          setLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      ++profileRequestId.current;
    };
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: profile?.role === "admin" || profile?.role === "super_admin",
      isSuperAdmin: profile?.role === "super_admin",
      isApprovedMember: profile?.membership_status === "approved",
      signOut,
      refreshProfile,
    }),
    [session, user, profile, loading, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
