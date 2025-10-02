import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("name")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
    };

    const fetchMyListings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("listings")
        .select("*, books(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setMyListings(data || []);
    };

    fetchProfile();
    fetchMyListings();
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
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome {profile ? profile.name : "Loading..."}!
        </h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <button
        onClick={() => navigate("/create-listing")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        + Create New Listing
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📚 My Listings</h2>
        {myListings.length === 0 ? (
          <p className="text-gray-500">You have no listings yet.</p>
        ) : (
          <ul className="space-y-2">
            {myListings.map((listing) => (
              <li key={listing.listing_id} className="border p-2 rounded">
                <strong>{listing.books.title}</strong> - ₹{listing.price} (
                {listing.status})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
