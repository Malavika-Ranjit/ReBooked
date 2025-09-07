
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// 1. Create the Auth context
const AuthContext = createContext();

// 2. AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // optional, for loading state

  useEffect(() => {
    // Fetch initial session
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchUser();

    // Listen to auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);
