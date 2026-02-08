import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  user: any;
  hasSubscription: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isCheckingRef = useRef(false);

  const checkSubscription = useCallback(async (accessToken: string) => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (error) {
        setHasSubscription(false);
        return;
      }

      setHasSubscription(data?.hasSubscription || false);
    } catch {
      setHasSubscription(false);
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (!error) setIsAdmin(data || false);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (!session) {
          setUser(null);
          setHasSubscription(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setUser(session.user);
        await Promise.all([
          checkSubscription(session.access_token),
          checkAdminRole(session.user.id),
        ]);
      } catch {
        if (isMounted) {
          setUser(null);
          setHasSubscription(false);
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        setTimeout(() => {
          if (isMounted) {
            checkSubscription(session.access_token);
            checkAdminRole(session.user.id);
          }
        }, 0);
      } else {
        setUser(null);
        setHasSubscription(false);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkSubscription, checkAdminRole]);

  return { user, hasSubscription, isAdmin, isLoading };
};
