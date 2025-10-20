// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/AuthContext";

// export default function Transactions() {
//   const { user } = useAuth();
//   const [incoming, setIncoming] = useState([]); // as seller
//   const [outgoing, setOutgoing] = useState([]); // as buyer

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     if (!user) return;

//     // Incoming requests (seller view)
//     const { data: sellerData, error: sellerError } = await supabase
//       .from("transactions")
//       .select("*, listings(*, books(*))")
//       .eq("seller_id", user.id)
//       .eq("status", "Pending")
//       .order("created_at", { ascending: false });
//     if (sellerError) console.error(sellerError);
//     else setIncoming(sellerData || []);

//     // Outgoing requests (buyer view)
//     const { data: buyerData, error: buyerError } = await supabase
//       .from("transactions")
//       .select("*, listings(*, books(*))")
//       .eq("buyer_id", user.id)
//       .eq("status", "Pending")
//       .order("created_at", { ascending: false });
//     if (buyerError) console.error(buyerError);
//     else setOutgoing(buyerData || []);
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [user]);

//   // Approve transaction (seller)
//   const handleApprove = async (transaction) => {
//     // Decrement listing copies
//     const newCopies = transaction.listings.copies_available - 1;
//     const status = newCopies <= 0 ? "Sold Out" : "Available";

//     const { error: updateListingError } = await supabase
//       .from("listings")
//       .update({ copies_available: newCopies, status })
//       .eq("listing_id", transaction.listing_id);
//     if (updateListingError) return alert(updateListingError.message);

//     // Update transaction status
//     const { error: updateTxError } = await supabase
//       .from("transactions")
//       .update({ status: "Approved" })
//       .eq("transaction_id", transaction.transaction_id);
//     if (updateTxError) return alert(updateTxError.message);

//     alert("Transaction approved!");
//     fetchTransactions();
//   };

//   // Reject transaction (seller)
//   const handleReject = async (transaction) => {
//     const { error } = await supabase
//       .from("transactions")
//       .update({ status: "Rejected" })
//       .eq("transaction_id", transaction.transaction_id);
//     if (error) return alert(error.message);
//     fetchTransactions();
//   };

//   // Cancel transaction (buyer)
//   const handleCancel = async (transaction) => {
//     const { error } = await supabase
//       .from("transactions")
//       .update({ status: "Cancelled" })
//       .eq("transaction_id", transaction.transaction_id);
//     if (error) return alert(error.message);
//     fetchTransactions();
//   };

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-3xl font-bold text-center mb-6">💳 Transactions</h1>

//       {/* Seller Section */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Incoming Requests (As Seller)</h2>
//         {incoming.length === 0 ? (
//           <p className="text-gray-500">No pending requests.</p>
//         ) : (
//           <ul className="space-y-2">
//             {incoming.map((tx) => (
//               <li key={tx.transaction_id} className="border p-4 rounded flex justify-between items-center shadow">
//                 <div>
//                   <strong>{tx.listings.books.title}</strong> requested by Buyer: {tx.buyer_id} <br />
//                   Price: ₹{tx.listings.price} | Copies left: {tx.listings.copies_available}
//                 </div>
//                 <div className="flex space-x-2">
//                   <button onClick={() => handleApprove(tx)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition">Approve</button>
//                   <button onClick={() => handleReject(tx)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition">Reject</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Buyer Section */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">My Purchase Requests (As Buyer)</h2>
//         {outgoing.length === 0 ? (
//           <p className="text-gray-500">No pending requests.</p>
//         ) : (
//           <ul className="space-y-2">
//             {outgoing.map((tx) => (
//               <li key={tx.transaction_id} className="border p-4 rounded flex justify-between items-center shadow">
//                 <div>
//                   <strong>{tx.listings.books.title}</strong> from Seller: {tx.seller_id} <br />
//                   Price: ₹{tx.listings.price} | Status: {tx.status}
//                 </div>
//                 <div>
//                   <button onClick={() => handleCancel(tx)} className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition">Cancel</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Transactions() {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);

  const fetchTransactions = async () => {
    if (!user) return;

    // Pending approvals (as seller)
    const { data: approvals } = await supabase
      .from("transactions")
      .select("*, listings(*, books(*)), buyer_id")
      .eq("seller_id", user.id)
      .eq("transaction_status", "Pending")
      .order("transaction_date", { ascending: false });

    // Pending requests (as buyer)
    const { data: requests } = await supabase
      .from("transactions")
      .select("*, listings(*, books(*)), seller_id")
      .eq("buyer_id", user.id)
      .eq("transaction_status", "Pending")
      .order("transaction_date", { ascending: false });

    // Completed transactions (both buyer and seller)
    const { data: completed } = await supabase
      .from("transactions")
      .select("*, listings(*, books(*))")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .eq("transaction_status", "Completed")
      .order("transaction_date", { ascending: false });

    setPendingApprovals(approvals || []);
    setPendingRequests(requests || []);
    setCompletedTransactions(completed || []);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const approveTransaction = async (transaction_id, listing_id) => {
    // Update transaction status to Completed
    await supabase
      .from("transactions")
      .update({ transaction_status: "Completed" })
      .eq("transaction_id", transaction_id);

    // Decrease listing copies by 1 or mark Sold Out if 0
    const { data: listing } = await supabase
      .from("listings")
      .select("*")
      .eq("listing_id", listing_id)
      .single();

    if (listing) {
      let newStatus = listing.status;
      // If you have a `copies_available` column
      if (listing.copies_available && listing.copies_available > 1) {
        await supabase
          .from("listings")
          .update({ copies_available: listing.copies_available - 1 })
          .eq("listing_id", listing_id);
      } else {
        newStatus = "Sold Out";
        await supabase
          .from("listings")
          .update({ status: newStatus, copies_available: 0 })
          .eq("listing_id", listing_id);
      }
    }

    fetchTransactions();
  };

  const cancelTransaction = async (transaction_id) => {
    await supabase
      .from("transactions")
      .update({ transaction_status: "Cancelled" })
      .eq("transaction_id", transaction_id);

    fetchTransactions();
  };

  if (!user)
    return <p className="p-6">Please log in to view your transactions.</p>;
  const containerStyle = {
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
  };

  const columnStyle = {
    flex: "1",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "1.55rem",
    fontWeight: "600",
    marginBottom: "12px",
  };

  const sectionTitle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",

  };

  const buttonStyle = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  const approveButton = {
    ...buttonStyle,
    backgroundColor: "#16a34a",
    color: "white",
  };

  const cancelButton = {
    ...buttonStyle,
    backgroundColor: "#dc2626",
    color: "white",
  };

  const undoButton = {
    ...buttonStyle,
    backgroundColor: "#f87171",
    color: "white",
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={sectionTitle}>Transactions</h1>
      <div style={containerStyle}>
      {/* Pending Approvals (as seller) */}
      <div style={columnStyle}>
        <h2 style={titleStyle}>📝 Pending Approvals (as Seller)</h2>
        {pendingApprovals.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No pending approvals.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pendingApprovals.map((t) => (
              <li key={t.transaction_id} style={{
                    borderBottom: "1px solid #eee",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }}>
                <div>
                  <strong>{t.listings.books.title}</strong> - ₹{t.listings.price} by buyer: {t.buyer_id}
                </div>
                <div style={{ marginTop: "6px" }}>
                  <button
                    onClick={() => approveTransaction(t.transaction_id, t.listing_id)}
                    style={approveButton}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => cancelTransaction(t.transaction_id)}
                    style={cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    
      {/* Pending Requests (as buyer) */}
      <div style={columnStyle}>
        <h2 style={titleStyle}>⏳ Pending Requests (as Buyer)</h2>
        {pendingRequests.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No pending requests.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pendingRequests.map((t) => (
             <li
  key={t.transaction_id}
  style={{
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
    marginBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <div>
    <strong style={{ fontWeight: "600", color: "#111827" }}>
      {t.listings.books.title}
    </strong>{" "}
    <span style={{ color: "#374151" }}>- ₹{t.listings.price}</span>{" "}
    <span style={{ color: "#6b7280" }}>by seller: {t.seller_id}</span>
  </div>
  <button
    onClick={() => cancelTransaction(t.transaction_id)}
    style={
      cancelButton
    }
    onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#e75959ff")}
  >
    Undo Request
  </button>
</li>

            ))}
          </ul>
        )}
      </div>

      {/* Completed Transactions */}
      <div style={columnStyle}>
        <h2 style={titleStyle}>✅ Completed Transactions</h2>
        {completedTransactions.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No completed transactions.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {completedTransactions.map((t) => (
              <li key={t.transaction_id} style={{
                    borderBottom: "1px solid #eee",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }}>
                <div>
  <strong style={{ fontWeight: "600", color: "#111827" }}>
    {t.listings.books.title}
  </strong>{" "}
  <span style={{ color: "#374151" }}>- ₹{t.listings.price}</span>{" "}
  {t.buyer_id === user.id ? (
    <span style={{ color: "#16a34a", fontWeight: "500" }}>(You bought this)</span>
  ) : (
    <span style={{ color: "#2563eb", fontWeight: "500" }}>(You sold this)</span>
  )}
</div>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
}
