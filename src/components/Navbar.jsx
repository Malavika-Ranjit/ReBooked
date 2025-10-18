import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("Users")
          .select("name")
          .eq("user_id", user.id)
          .single();

        if (!error) setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="navtitle">ReBooked</div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-400">Home</Link>
        <Link to="/about" className="hover:text-yellow-400">About</Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:text-yellow-400">Login</Link>
            <Link to="/register" className="hover:text-yellow-400">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:text-yellow-400">
              Hi, {profile ? profile.name : "Loading..."}
            </Link>
            <Link to="/listings" className="hover:text-yellow-400">Listings</Link>
            <Link to="/transactions" className="hover:text-yellow-400">Transactions</Link>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
