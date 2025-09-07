import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
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

        if (error) {
          console.error("Error fetching profile:", error.message);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <h2 className="text-xl font-semibold text-gray-700">
          Please log in to access the Dashboard
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome {profile ? profile.name : "Loading..."}!
        </h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      {/* Placeholder for Listings & Transactions */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold">📚 My Listings</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold">💳 My Transactions</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}
