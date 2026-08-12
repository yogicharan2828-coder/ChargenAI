import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get Supabase session:", error);
      }

      if (mounted) {
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession ?? null);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // -----------------------------
  // SIGN UP
  // -----------------------------
  const signUp = async ({ email, password, name }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (error) {
      console.error("SUPABASE SIGNUP ERROR:", {
        message: error.message,
        code: error.code,
        status: error.status,
      });

      throw error;
    }

    return data;
  };

  // -----------------------------
  // SIGN IN
  // -----------------------------
  const signIn = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      console.error("SUPABASE LOGIN ERROR:", {
        message: error.message,
        code: error.code,
        status: error.status,
      });

      throw error;
    }

    return data;
  };

  // -----------------------------
  // GOOGLE LOGIN
  // -----------------------------
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("GOOGLE LOGIN ERROR:", error);
      throw error;
    }

    return data;
  };

  // -----------------------------
  // GITHUB LOGIN
  // -----------------------------
  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("GITHUB LOGIN ERROR:", error);
      throw error;
    }

    return data;
  };

  // -----------------------------
  // PASSWORD RESET
  // -----------------------------
  const resetPassword = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } =
      await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

    if (error) {
      console.error("PASSWORD RESET ERROR:", {
        message: error.message,
        code: error.code,
        status: error.status,
      });

      throw error;
    }

    return data;
  };

  // -----------------------------
  // SIGN OUT
  // -----------------------------
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("SIGN OUT ERROR:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}