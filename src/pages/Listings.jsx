import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Listings() {
  const [allListings, setAllListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, books(*)")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error.message);
      } else {
        setAllListings(data || []);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = allListings.filter(
    (listing) =>
      listing.books.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.books.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Marketplace</h1>

      <input
        type="text"
        placeholder="Search by title or author"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 w-full mb-6 rounded"
      />

      {filteredListings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <div
              key={listing.listing_id}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">{listing.books.title}</h3>
              <p>Author: {listing.books.author}</p>
              {listing.books.course && <p>Course: {listing.books.course}</p>}
              <p>Price: ₹{listing.price}</p>
              <p>Status: {listing.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
