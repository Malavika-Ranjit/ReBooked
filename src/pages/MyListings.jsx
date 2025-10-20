// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/AuthContext";
// import "./Listings.css";

// export default function MyListings() {
//   const { user } = useAuth();
//   const [myListings, setMyListings] = useState([]);
//   const [editing, setEditing] = useState(null); // listing being edited
//   const [newCopies, setNewCopies] = useState(0);

//   const fetchListings = async () => {
//     if (!user) return;
//     const { data, error } = await supabase
//       .from("listings")
//       .select("*, books(*)")
//       .eq("user_id", user.id)
//       .order("created_at", { ascending: false });

//     if (error) console.error(error);
//     else setMyListings(data || []);
//   };

//   useEffect(() => {
//     fetchListings();
//   }, [user]);

//   const handleEdit = (listing) => {
//     setEditing(listing.listing_id);
//     setNewCopies(listing.copies_available);
//   };

//   const handleSave = async (listing) => {
//     const status = newCopies > 0 ? "Available" : "Sold Out";
//     const { error } = await supabase
//       .from("listings")
//       .update({ copies_available: newCopies, status })
//       .eq("listing_id", listing.listing_id);

//     if (error) {
//       alert("Error updating listing: " + error.message);
//     } else {
//       setEditing(null);
//       fetchListings();
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold text-center mb-6">📚 My Listings</h1>

//       {myListings.length === 0 ? (
//         <p className="text-gray-500 text-center">You have no listings yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {myListings.map((listing) => (
//             <li
//               key={listing.listing_id}
//               className="border p-4 rounded shadow flex flex-col md:flex-row justify-between items-center"
//             >
//               <div>
//                 <strong>{listing.books.title}</strong> - {listing.books.author}{" "}
//                 {listing.books.course && `| ${listing.books.course}`} <br />
//                 Price: ₹{listing.price} <br />
//                 Copies: {listing.copies_available} | Status: {listing.status}
//               </div>

//               {editing === listing.listing_id ? (
//                 <div className="flex items-center space-x-2 mt-2 md:mt-0">
//                   <input
//                     type="number"
//                     min={0}
//                     value={newCopies}
//                     onChange={(e) => setNewCopies(Number(e.target.value))}
//                     className="border p-1 rounded w-20"
//                   />
//                   <button
//                     onClick={() => handleSave(listing)}
//                     className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setEditing(null)}
//                     className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => handleEdit(listing)}
//                   className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mt-2 md:mt-0"
//                 >
//                   Restock / Edit Copies
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Listings.css";

export default function MyListings() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newCopies, setNewCopies] = useState(0);

  const fetchListings = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("listings")
      .select("*, books(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else {
      const listingsWithStatus = data.map((listing) => ({
        ...listing,
        status: listing.copies_available > 0 ? "Available" : "Sold Out",
      }));
      setMyListings(listingsWithStatus || []);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [user]);

  const handleEdit = (listing) => {
    setEditing(listing.listing_id);
    setNewCopies(listing.copies_available);
  };

  const handleSave = async (listing) => {
    const status = newCopies > 0 ? "Available" : "Sold Out";
    const { error } = await supabase
      .from("listings")
      .update({ copies_available: newCopies, status })
      .eq("listing_id", listing.listing_id);

    if (error) {
      alert("Error updating listing: " + error.message);
    } else {
      setEditing(null);
      fetchListings();
    }
  };

  return (
    <div className="p-6">
      <h1 className="page-title">📚 My Listings</h1>

      {myListings.length === 0 ? (
        <p className="text-gray-500 text-center">You have no listings yet.</p>
      ) : (
        <div className="marketplace-container">
          {myListings.map((listing) => (
            <div key={listing.listing_id} className="book-card">
              <h3>{listing.books.title}</h3>
              <p>
                <strong>Author:</strong> {listing.books.author}
              </p>
              {listing.books.course && (
                <p>
                  <strong>Course:</strong> {listing.books.course}
                </p>
              )}
              <p className="price">₹{listing.price}</p>
              <p>
                <strong>Copies:</strong> {listing.copies_available}
              </p>

              {listing.status === "Available" ? (
                <span className="status-available">{listing.status}</span>
              ) : (
                <span className="status-sold">{listing.status}</span>
              )}

              {editing === listing.listing_id ? (
                <div className="edit-section">
                  <input
                    type="number"
                    min={0}
                    value={newCopies}
                    onChange={(e) => setNewCopies(Number(e.target.value))}
                  />
                  <button className="save-btn" onClick={() => handleSave(listing)}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="edit-btn" onClick={() => handleEdit(listing)}>
                  ✏️ Restock / Edit Copies
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
