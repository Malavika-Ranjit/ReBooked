// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// export default function Listings() {
//   const [allListings, setAllListings] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchListings = async () => {
//       const { data, error } = await supabase
//         .from("listings")
//         .select("*, books(*)")
//         .eq("status", "Available")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error fetching listings:", error.message);
//       } else {
//         setAllListings(data || []);
//       }
//     };

//     fetchListings();
//   }, []);

//   const filteredListings = allListings.filter(
//     (listing) =>
//       listing.books.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       listing.books.author.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">📚 Marketplace</h1>

//       <input
//         type="text"
//         placeholder="Search by title or author"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="border p-2 w-full mb-6 rounded"
//       />

//       {filteredListings.length === 0 ? (
//         <p className="text-gray-500">No listings found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredListings.map((listing) => (
//             <div
//               key={listing.listing_id}
//               className="border p-4 rounded shadow hover:shadow-md transition"
//             >
//               <h3 className="font-bold text-lg">{listing.books.title}</h3>
//               <p>Author: {listing.books.author}</p>
//               {listing.books.course && <p>Course: {listing.books.course}</p>}
//               <p>Price: ₹{listing.price}</p>
//               <p>Status: {listing.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/AuthContext";

// export default function Listings() {
//   const { user } = useAuth();
//   const [allListings, setAllListings] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchListings = async () => {
//       const { data, error } = await supabase
//         .from("listings")
//         .select("*, books(*), user_id")
//         .eq("status", "Available")
//         .order("created_at", { ascending: false });
//       if (error) console.error(error);
//       else setAllListings(data || []);
//     };
//     fetchListings();
//   }, []);

//   const handleBuy = async (listingId) => {
//     const listing = allListings.find(l => l.listing_id === listingId);
//     if (!listing || listing.user_id === user.id) return alert("Cannot buy your own listing");

//     const { error } = await supabase.from("transactions").insert([{ listing_id: listingId, buyer_id: user.id, seller_id: listing.user_id, status: "Pending" }]);
//     if (error) console.error(error);
//     else alert("Purchase request sent!");
//   };

//   const filteredListings = allListings.filter(
//     l => l.books.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.books.author.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">📚 Marketplace</h1>
//       <input type="text" placeholder="Search by title or author" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="border p-2 w-full mb-6 rounded" />
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredListings.map(listing => (
//           <div key={listing.listing_id} className="border p-4 rounded shadow flex flex-col justify-between">
//             <div>
//               <h3 className="font-bold text-lg">{listing.books.title}</h3>
//               <p>Author: {listing.books.author}</p>
//               {listing.books.course && <p>Course: {listing.books.course}</p>}
//               <p>Price: ₹{listing.price}</p>
//               <p>Copies: {listing.copies_available}</p>
//               <p>Status: {listing.status}</p>
//             </div>
//             {user.id !== listing.user_id && (
//               <button onClick={() => handleBuy(listing.listing_id)} className="mt-2 bg-green-600 text-white py-1 rounded hover:bg-green-700 transition">
//                 Buy
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/AuthContext";

// export default function Listings() {
//   const { user } = useAuth();
//   const [allListings, setAllListings] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch listings and automatically compute status based on copies
//   const fetchListings = async () => {
//     const { data, error } = await supabase
//       .from("listings")
//       .select("*, books(*), user_id")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Error fetching listings:", error.message);
//       return;
//     }

//     // Compute status based on copies_available
//     const listingsWithStatus = data.map((listing) => ({
//       ...listing,
//       status:
//         listing.copies_available > 0 ? "Available" : "Sold Out",
//     }));

//     setAllListings(listingsWithStatus);
//   };

//   useEffect(() => {
//     fetchListings();
//   }, []);

//   const handleBuy = async (listing) => {
//     if (!user) {
//       alert("You must be logged in to buy a book.");
//       return;
//     }

//     if (listing.user_id === user.id) {
//       alert("You cannot buy your own listing.");
//       return;
//     }

//     if (listing.copies_available <= 0) {
//       alert("This book is sold out!");
//       return;
//     }

//     // Insert transaction as Pending
//     const { error } = await supabase.from("transactions").insert([
//       {
//         listing_id: listing.listing_id,
//         buyer_id: user.id,
//         seller_id: listing.user_id,
//         transaction_type: "Buy",
//         transaction_status: "Pending",
//       },
//     ]);

//     if (error) {
//       console.error("Error creating transaction:", error.message);
//       alert("Failed to send buy request.");
//     } else {
//       alert("Buy request sent! Waiting for seller approval.");
//     }
//   };

//   // Filter for search
//   const filteredListings = allListings.filter(
//     (listing) =>
//       listing.books.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       listing.books.author.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">📚 Marketplace</h1>

//       <input
//         type="text"
//         placeholder="Search by title or author"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="border p-2 w-full mb-6 rounded"
//       />

//       {filteredListings.length === 0 ? (
//         <p className="text-gray-500">No listings found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredListings.map((listing) => (
//             <div
//               key={listing.listing_id}
//               className="border p-4 rounded shadow hover:shadow-md transition flex flex-col justify-between"
//             >
//               <div>
//                 <h3 className="font-bold text-lg">{listing.books.title}</h3>
//                 <p>Author: {listing.books.author}</p>
//                 {listing.books.course && <p>Course: {listing.books.course}</p>}
//                 <p>Price: ₹{listing.price}</p>
//                 <p>Copies: {listing.copies_available}</p>
//                 <p>Status: {listing.status}</p>
//               </div>

//               {user && listing.user_id !== user.id && listing.copies_available > 0 && (
//                 <button
//                   onClick={() => handleBuy(listing)}
//                   className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                 >
//                   Buy
//                 </button>
//               )}

//               {user && listing.user_id === user.id && (
//                 <p className="mt-2 text-gray-500 italic">Your listing</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Listings() {
  const { user } = useAuth();
  const [allListings, setAllListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, books(*), user_id")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error.message);
      return;
    }

    const listingsWithStatus = data.map((listing) => ({
      ...listing,
      status: listing.copies_available > 0 ? "Available" : "Sold Out",
    }));

    setAllListings(listingsWithStatus);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleBuy = async (listing) => {
    if (!user) {
      alert("You must be logged in to buy a book.");
      return;
    }

    if (listing.user_id === user.id) {
      alert("You cannot buy your own listing.");
      return;
    }

    if (listing.copies_available <= 0) {
      alert("This book is sold out!");
      return;
    }

    const { error } = await supabase.from("transactions").insert([
      {
        listing_id: listing.listing_id,
        buyer_id: user.id,
        seller_id: listing.user_id,
        transaction_type: "Buy",
        transaction_status: "Pending",
      },
    ]);

    if (error) {
      console.error("Error creating transaction:", error.message);
      alert("Failed to send buy request.");
    } else {
      alert("Buy request sent! Waiting for seller approval.");
    }
  };

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
        <p className="text-gray-500 text-center">No listings found.</p>
      ) : (
        <div className="marketplace-container">
          {filteredListings.map((listing) => (
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

              {user && listing.user_id !== user.id && listing.copies_available > 0 && (
                <button onClick={() => handleBuy(listing)}>Buy</button>
              )}

              {user && listing.user_id === user.id && (
                <p className="mt-2 text-gray-500 italic">Your listing</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
