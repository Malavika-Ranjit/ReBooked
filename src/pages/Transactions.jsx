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

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Transactions</h1>

      {/* Pending Approvals (as seller) */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📝 Pending Approvals (as Seller)</h2>
        {pendingApprovals.length === 0 ? (
          <p className="text-gray-500">No pending approvals.</p>
        ) : (
          <ul className="space-y-2">
            {pendingApprovals.map((t) => (
              <li key={t.transaction_id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <strong>{t.listings.books.title}</strong> - ₹{t.listings.price} by buyer: {t.buyer_id}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => approveTransaction(t.transaction_id, t.listing_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => cancelTransaction(t.transaction_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
      <div>
        <h2 className="text-xl font-semibold mb-2">⏳ Pending Requests (as Buyer)</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <ul className="space-y-2">
            {pendingRequests.map((t) => (
              <li key={t.transaction_id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <strong>{t.listings.books.title}</strong> - ₹{t.listings.price} by seller: {t.seller_id}
                </div>
                <button
                  onClick={() => cancelTransaction(t.transaction_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Undo Request
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Completed Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">✅ Completed Transactions</h2>
        {completedTransactions.length === 0 ? (
          <p className="text-gray-500">No completed transactions.</p>
        ) : (
          <ul className="space-y-2">
            {completedTransactions.map((t) => (
              <li key={t.transaction_id} className="border p-2 rounded">
                <div>
                  <strong>{t.listings.books.title}</strong> - ₹{t.listings.price} 
                  {t.buyer_id === user.id ? " (You bought this)" : " (You sold this)"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
