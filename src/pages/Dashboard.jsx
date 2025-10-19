// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [myListings, setMyListings] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user) return;
//       const { data } = await supabase
//         .from("users")
//         .select("name")
//         .eq("user_id", user.id)
//         .single();
//       setProfile(data);
//     };

//     const fetchMyListings = async () => {
//       if (!user) return;
//       const { data } = await supabase
//         .from("listings")
//         .select("*, books(*)")
//         .eq("user_id", user.id)
//         .order("created_at", { ascending: false });
//       setMyListings(data || []);
//     };

//     fetchProfile();
//     fetchMyListings();
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-[80vh]">
//         <h2 className="text-xl font-semibold text-gray-700">
//           Please log in to access the Dashboard
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-8">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold mb-2">
//           Welcome {profile ? profile.name : "Loading..."}!
//         </h1>
//         <p className="text-gray-600">{user.email}</p>
//       </div>

//       <button
//         onClick={() => navigate("/create-listing")}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//       >
//         + Create New Listing
//       </button>

//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">📚 My Listings</h2>
//         {myListings.length === 0 ? (
//           <p className="text-gray-500">You have no listings yet.</p>
//         ) : (
//           <ul className="space-y-2">
//             {myListings.map((listing) => (
//               <li key={listing.listing_id} className="border p-2 rounded">
//                 <strong>{listing.books.title}</strong> - ₹{listing.price} (
//                 {listing.status})
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [pendingApprovals, setPendingApprovals] = useState(0);
//   const [pendingRequests, setPendingRequests] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) return;

//     const fetchProfile = async () => {
//       const { data } = await supabase
//         .from("users")
//         .select("name")
//         .eq("user_id", user.id)
//         .single();
//       setProfile(data);
//     };

//     const fetchSummary = async () => {
//       const { count: approvalsCount } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("seller_id", user.id)
//         .eq("status", "Pending");

//       const { count: requestsCount } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("buyer_id", user.id)
//         .eq("status", "Pending");

//       setPendingApprovals(approvalsCount || 0);
//       setPendingRequests(requestsCount || 0);
//     };

//     fetchProfile();
//     fetchSummary();
//   }, [user]);

//   if (!user) return <p className="p-6">Please log in to access the dashboard.</p>;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Welcome, {profile?.name}</h1>
//       <p>{user.email}</p>

//       <div className="flex space-x-4">
//         <button
//           onClick={() => navigate("/create-listing")}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           + Create Listing
//         </button>
//         <button
//           onClick={() => navigate("/transactions")}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Transactions
//         </button>
//         <button
//           onClick={() => navigate("/mylistings")}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//         >
//           My Listings
//         </button>
//       </div>

//       <div className="flex space-x-4 mt-6">
//         <div className="bg-yellow-200 p-4 rounded">
//           <h2>Pending Approvals</h2>
//           <p className="text-xl font-bold">{pendingApprovals}</p>
//         </div>
//         <div className="bg-orange-200 p-4 rounded">
//           <h2>Pending Requests</h2>
//           <p className="text-xl font-bold">{pendingRequests}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    myListings: 0,
    booksBought: 0,
    pendingApprovals: 0,
    pendingRequests: 0,
    availableListings: 0,
    soldOutListings: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select("name")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
    };

    const fetchStats = async () => {
      // My Listings
      const { count: myListings } = await supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      // Books Bought (Completed)
      const { count: booksBought } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("buyer_id", user.id)
        .eq("transaction_status", "Completed");

      // Pending Approvals (as seller)
      const { count: pendingApprovals } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("seller_id", user.id)
        .eq("transaction_status", "Pending");

      // Pending Requests (as buyer)
      const { count: pendingRequests } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("buyer_id", user.id)
        .eq("transaction_status", "Pending");

      // Available Listings in marketplace
      const { count: availableListings } = await supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("status", "Available");

      // Sold Out Listings (yours)
      const { count: soldOutListings } = await supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .eq("status", "Sold Out");

      setStats({
        myListings,
        booksBought,
        pendingApprovals,
        pendingRequests,
        availableListings,
        soldOutListings,
      });
    };

    fetchProfile();
    fetchStats();
  }, [user]);

  if (!user) return <p className="p-6">Please log in to access the dashboard.</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {profile?.name}</h1>
        <p>{user.email}</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-4">
        <button onClick={() => navigate("/create-listing")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Create Listing
        </button>
        <button onClick={() => navigate("/mylistings")} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          My Listings
        </button>
        <button onClick={() => navigate("/transactions")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Transactions
        </button>
        <button onClick={() => navigate("/listings")} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Marketplace
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-yellow-200 p-4 rounded shadow">
          <h2>My Listings</h2>
          <p className="text-xl font-bold">{stats.myListings}</p>
        </div>
        <div className="bg-green-200 p-4 rounded shadow">
          <h2>Books Bought</h2>
          <p className="text-xl font-bold">{stats.booksBought}</p>
        </div>
        <div className="bg-red-200 p-4 rounded shadow">
          <h2>Pending Approvals</h2>
          <p className="text-xl font-bold">{stats.pendingApprovals}</p>
        </div>
        <div className="bg-orange-200 p-4 rounded shadow">
          <h2>Pending Requests</h2>
          <p className="text-xl font-bold">{stats.pendingRequests}</p>
        </div>
        <div className="bg-blue-200 p-4 rounded shadow">
          <h2>Available Listings</h2>
          <p className="text-xl font-bold">{stats.availableListings}</p>
        </div>
        <div className="bg-purple-200 p-4 rounded shadow">
          <h2>Sold Out Listings</h2>
          <p className="text-xl font-bold">{stats.soldOutListings}</p>
        </div>
      </div>
    </div>
  );
}
