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


// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState({
//     myListings: 0,
//     booksBought: 0,
//     pendingApprovals: 0,
//     pendingRequests: 0,
//     availableListings: 0,
//     soldOutListings: 0,
//   });
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

//     const fetchStats = async () => {
//       // My Listings
//       const { count: myListings } = await supabase
//         .from("listings")
//         .select("*", { count: "exact" })
//         .eq("user_id", user.id);

//       // Books Bought (Completed)
//       const { count: booksBought } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("buyer_id", user.id)
//         .eq("transaction_status", "Completed");

//       // Pending Approvals (as seller)
//       const { count: pendingApprovals } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("seller_id", user.id)
//         .eq("transaction_status", "Pending");

//       // Pending Requests (as buyer)
//       const { count: pendingRequests } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("buyer_id", user.id)
//         .eq("transaction_status", "Pending");

//       // Available Listings in marketplace
//       const { count: availableListings } = await supabase
//         .from("listings")
//         .select("*", { count: "exact" })
//         .eq("status", "Available");

//       // Sold Out Listings (yours)
//       const { count: soldOutListings } = await supabase
//         .from("listings")
//         .select("*", { count: "exact" })
//         .eq("user_id", user.id)
//         .eq("status", "Sold Out");

//       setStats({
//         myListings,
//         booksBought,
//         pendingApprovals,
//         pendingRequests,
//         availableListings,
//         soldOutListings,
//       });
//     };

//     fetchProfile();
//     fetchStats();
//   }, [user]);

//   if (!user) return <p className="p-6">Please log in to access the dashboard.</p>;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Welcome Section */}
//       <div>
//         <h1 className="text-3xl font-bold">Welcome, {profile?.name}</h1>
//         <p>{user.email}</p>
//       </div>

//       {/* Quick Action Buttons */}
//       <div className="flex flex-wrap gap-4 mt-4">
//         <button onClick={() => navigate("/create-listing")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//           + Create Listing
//         </button>
//         <button onClick={() => navigate("/mylistings")} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
//           My Listings
//         </button>
//         <button onClick={() => navigate("/transactions")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           Transactions
//         </button>
//         <button onClick={() => navigate("/listings")} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
//           Marketplace
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//         <div className="bg-yellow-200 p-4 rounded shadow">
//           <h2>My Listings</h2>
//           <p className="text-xl font-bold">{stats.myListings}</p>
//         </div>
//         <div className="bg-green-200 p-4 rounded shadow">
//           <h2>Books Bought</h2>
//           <p className="text-xl font-bold">{stats.booksBought}</p>
//         </div>
//         <div className="bg-red-200 p-4 rounded shadow">
//           <h2>Pending Approvals</h2>
//           <p className="text-xl font-bold">{stats.pendingApprovals}</p>
//         </div>
//         <div className="bg-orange-200 p-4 rounded shadow">
//           <h2>Pending Requests</h2>
//           <p className="text-xl font-bold">{stats.pendingRequests}</p>
//         </div>
//         <div className="bg-blue-200 p-4 rounded shadow">
//           <h2>Available Listings</h2>
//           <p className="text-xl font-bold">{stats.availableListings}</p>
//         </div>
//         <div className="bg-purple-200 p-4 rounded shadow">
//           <h2>Sold Out Listings</h2>
//           <p className="text-xl font-bold">{stats.soldOutListings}</p>
//         </div>
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
//   const [stats, setStats] = useState({
//     myListings: 0,
//     booksBought: 0,
//     pendingApprovals: 0,
//     pendingRequests: 0,
//     availableListings: 0,
//     soldOutListings: 0,
//   });
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

//     const fetchStats = async () => {
//       const { count: myListings } = await supabase
//         .from("listings")
//         .select("*", { count: "exact" })
//         .eq("user_id", user.id);

//       const { count: booksBought } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("buyer_id", user.id)
//         .eq("transaction_status", "Completed");

//       const { count: pendingApprovals } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("seller_id", user.id)
//         .eq("transaction_status", "Pending");

//       const { count: pendingRequests } = await supabase
//         .from("transactions")
//         .select("*", { count: "exact" })
//         .eq("buyer_id", user.id)
//         .eq("transaction_status", "Pending");

//       const { count: availableListings } = await supabase
//         .from("listings")
//         .select("*", { count: "exact" })
//         .eq("status", "Available");

//       const { count: soldOutListings } = await supabase
//         .from("listings")
//         .select("*", { count: "exact" })
//         .eq("user_id", user.id)
//         .eq("status", "Sold Out");

//       setStats({
//         myListings,
//         booksBought,
//         pendingApprovals,
//         pendingRequests,
//         availableListings,
//         soldOutListings,
//       });
//     };

//     fetchProfile();
//     fetchStats();
//   }, [user]);

//   if (!user) return <p style={{ padding: 20, fontSize: 18 }}>Please log in to access the dashboard.</p>;

//   const buttonStyle = {
//     flex: 1,
//     minWidth: 160,
//     padding: "20px 0",
//     fontSize: 18,
//     fontWeight: 600,
//     borderRadius: 12,
//     cursor: "pointer",
//     textAlign: "center",
//     color: "#fff",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//     transition: "all 0.3s ease",
//     backgroundColor: "#2563eb", // same blue for all action buttons
//   };

//   const statsBoxStyle = {
//     padding: 30,
//     borderRadius: 16,
//     boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
//     textAlign: "center",
//     fontWeight: 600,
//     fontSize: 22,
//     color: "#fff",
//   };

//   return (
//     <div style={{ padding: 30, fontFamily: "Poppins, sans-serif" }}>
//       {/* Welcome Section */}
//       <div style={{ textAlign: "center", marginBottom: 40 }}>
//         <h1 style={{ fontSize: 42, fontWeight: "bold", marginBottom: 10 }}>
//           Welcome, {profile?.name || "Loading..."}!
//         </h1>
//         <p style={{ fontSize: 18, color: "#555" }}>{user.email}</p>
//       </div>

//       {/* Quick Action Buttons */}
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", marginBottom: 50 }}>
//         <div style={buttonStyle} onClick={() => navigate("/create-listing")}>+ Create Listing</div>
//         <div style={buttonStyle} onClick={() => navigate("/mylistings")}>My Listings</div>
//         <div style={buttonStyle} onClick={() => navigate("/transactions")}>Transactions</div>
//         <div style={buttonStyle} onClick={() => navigate("/listings")}>Marketplace</div>
//       </div>

//       {/* Stats Grid */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//           gap: 25,
//         }}
//       >
//         <div style={{ ...statsBoxStyle, backgroundColor: "#1d4ed8" }}>
//           <div>My Listings</div>
//           <div style={{ fontSize: 32 }}>{stats.myListings}</div>
//         </div>
//         <div style={{ ...statsBoxStyle, backgroundColor: "#16a34a" }}>
//           <div>Books Bought</div>
//           <div style={{ fontSize: 32 }}>{stats.booksBought}</div>
//         </div>
//         <div style={{ ...statsBoxStyle, backgroundColor: "#dc2626" }}>
//           <div>Pending Approvals</div>
//           <div style={{ fontSize: 32 }}>{stats.pendingApprovals}</div>
//         </div>
//         <div style={{ ...statsBoxStyle, backgroundColor: "#f97316" }}>
//           <div>Pending Requests</div>
//           <div style={{ fontSize: 32 }}>{stats.pendingRequests}</div>
//         </div>
//         <div style={{ ...statsBoxStyle, backgroundColor: "#2563eb" }}>
//           <div>Available Listings</div>
//           <div style={{ fontSize: 32 }}>{stats.availableListings}</div>
//         </div>
//         <div style={{ ...statsBoxStyle, backgroundColor: "#6b21a8" }}>
//           <div>Sold Out Listings</div>
//           <div style={{ fontSize: 32 }}>{stats.soldOutListings}</div>
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
      const { count: myListings } = await supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      const { count: booksBought } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("buyer_id", user.id)
        .eq("transaction_status", "Completed");

      const { count: pendingApprovals } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("seller_id", user.id)
        .eq("transaction_status", "Pending");

      const { count: pendingRequests } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("buyer_id", user.id)
        .eq("transaction_status", "Pending");

      const { count: availableListings } = await supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("status", "Available");

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

  if (!user)
    return (
      <p style={{ padding: 20, fontSize: 18, fontWeight: 600 }}>
        Please log in to access the dashboard.
      </p>
    );

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #111827;
          color: white;
          font-family: 'Poppins', sans-serif;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .dashboard-title {
          font-size: 3rem;
          font-weight: 700;
          color: #facc15;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
        }

        .dashboard-subtitle {
          font-size: 1.3rem;
          color: #d1d5db;
          font-weight: 500;
          margin-bottom: 3rem;
        }

        .dashboard-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.2rem;
          margin-bottom: 3.5rem;
        }

        .dashboard-button {
          background-color: #1f2937;
          color: #facc15;
          font-weight: 600;
          font-size: 1.1rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          cursor: pointer;
          border: 2px solid transparent;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          transition: all 0.25s ease-in-out;
        }

        .dashboard-button:hover {
          background-color: #facc15;
          color: #111827;
          border-color: #facc15;
          transform: translateY(-4px);
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 1000px;
        }

        .dashboard-card {
          background-color: #1f2937;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .dashboard-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        /* ✅ White text for stats */
        .dashboard-card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #ffffff; /* white text */
          margin-bottom: 1rem;
        }

        .dashboard-card-value {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff; /* white numbers */
        }
      `}</style>

      {/* Welcome Section */}
      <h1 className="dashboard-title">
        Welcome, {profile?.name || "Loading..."}!
      </h1>
      <p className="dashboard-subtitle">{user.email}</p>

      {/* Buttons */}
      <div className="dashboard-actions">
        <div
          className="dashboard-button"
          onClick={() => navigate("/create-listing")}
        >
          + Create Listing
        </div>
        <div
          className="dashboard-button"
          onClick={() => navigate("/mylistings")}
        >
          My Listings
        </div>
        <div
          className="dashboard-button"
          onClick={() => navigate("/transactions")}
        >
          Transactions
        </div>
        <div
          className="dashboard-button"
          onClick={() => navigate("/listings")}
        >
          Marketplace
        </div>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        {[
          { label: "My Listings", value: stats.myListings },
          { label: "Books Bought", value: stats.booksBought },
          { label: "Pending Approvals", value: stats.pendingApprovals },
          { label: "Pending Requests", value: stats.pendingRequests },
          { label: "Available Listings", value: stats.availableListings },
          { label: "Sold Out Listings", value: stats.soldOutListings },
        ].map((item, idx) => (
          <div className="dashboard-card" key={idx}>
            <div className="dashboard-card-title">{item.label}</div>
            <div className="dashboard-card-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
