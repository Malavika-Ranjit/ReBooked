// import { useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function CreateListing() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [course, setCourse] = useState("");
//   const [price, setPrice] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       alert("You must be logged in to create a listing.");
//       return;
//     }

//     // Step 1: Check if book exists
//     const { data: existingBooks } = await supabase
//       .from("books")
//       .select("book_id")
//       .eq("title", title)
//       .eq("author", author)
//       .limit(1);

//     let bookId;

//     // Step 2: Insert book if not exists
//     if (existingBooks && existingBooks.length > 0) {
//       bookId = existingBooks[0].book_id;
//     } else {
//       const { data: newBook, error: insertBookError } = await supabase
//         .from("books")
//         .insert([{ title, author, course }])
//         .select("book_id")
//         .single();

//       if (insertBookError) {
//         console.error(insertBookError);
//         alert("Error adding book: " + insertBookError.message);
//         return;
//       }

//       bookId = newBook.book_id;
//     }

//     // Step 3: Insert listing (status = "Available" by default)
//     const { error: listingError } = await supabase.from("listings").insert([
//       {
//         user_id: user.id,
//         book_id: bookId,
//         price,
//         status: "Available",
//       },
//     ]);

//     if (listingError) {
//       console.error(listingError);
//       alert("Error creating listing: " + listingError.message);
//     } else {
//       alert("Listing created successfully!");
//       navigate("/dashboard");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
//       <h1 className="text-2xl font-bold mb-6 text-center">➕ Create Listing</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Book Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           placeholder="Author"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           placeholder="Course (optional)"
//           value={course}
//           onChange={(e) => setCourse(e.target.value)}
//           className="w-full border p-2 rounded"
//         />
//         <input
//           type="number"
//           placeholder="Price (₹)"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
//         >
//           Create Listing
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");
  const [copies, setCopies] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");

    // Check if book exists
    const { data: existingBooks } = await supabase
      .from("books")
      .select("book_id")
      .eq("title", title)
      .eq("author", author)
      .limit(1);

    let bookId;
    if (existingBooks && existingBooks.length > 0) {
      bookId = existingBooks[0].book_id;
    } else {
      const { data: newBook, error: insertBookError } = await supabase
        .from("books")
        .insert([{ title, author, course }])
        .select("book_id")
        .single();

      if (insertBookError) return alert("Error adding book: " + insertBookError.message);
      bookId = newBook.book_id;
    }

    // Insert listing with auto status
    const status = copies > 0 ? "Available" : "Sold Out";
    const { error: listingError } = await supabase.from("listings").insert([
      { user_id: user.id, book_id: bookId, price, copies_available: copies, status }
    ]);

    if (listingError) return alert("Error creating listing: " + listingError.message);
    alert("Listing created successfully!");
    navigate("/mylistings");
  };

  return (
     <div  style={{
        height: "100vh", display: "flex",
        justifyContent: "center",alignItems: "center",
        backgroundColor: "#e7edf0ff",
      }}>
      <div style={{
      width: "35rem",margin: "2.5rem auto 0", padding: "3.5rem", 
      backgroundColor: "white", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "0.5rem", marginBottom: "6.5rem"}}>
        <h1 style={{
        fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5em", 
        textAlign: "center",  }}>
           ➕ Create a New Listing</h1>

        <form onSubmit={handleSubmit}  style={{
    display: "flex",
    flexDirection: "column",
    gap: "1rem", 
  }}>
          <input type="text" placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{
      width: "100%", 
      height:"25px",
      border: "1px solid #ccc", 
      padding: "0.5rem", 
      borderRadius: "0.25rem", 
    }} required />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} style={{
      width: "100%", 
       height:"25px",
      border: "1px solid #ccc", 
      padding: "0.5rem",
      borderRadius: "0.25rem", 
    }} required />
        <input type="text" placeholder="Course (optional)" value={course} onChange={(e) => setCourse(e.target.value)}  style={{
      width: "100%", 
       height:"25px",
      border: "1px solid #ccc", 
      padding: "0.5rem", 
      borderRadius: "0.25rem", 
    }}/>
        <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)}  style={{
      width: "100%",
       height:"25px",
      border: "1px solid #ccc", 
      padding: "0.5rem", 
      borderRadius: "0.25rem", 
    }} required />
        <input type="number" placeholder="Copies Available" value={copies} onChange={(e) => setCopies(e.target.value)}  style={{
      width: "100%", 
       height:"25px",
      border: "1px solid #ccc", 
      padding: "0.5rem", 
      borderRadius: "0.25rem", 
    }} min="1" required />
        <button type="submit"  style={{
    width: "50%",
     height:"35px",             
    backgroundColor: "#16a34a", 
    color: "white",             
    padding: "0.5rem 0",        
    borderRadius: "0.25rem",    
    border: "none",
    cursor: "pointer",
    marginLeft:"8rem",
    fontSize:"20px",
    
    transition: "background-color 0.3s ease", 
  }} onMouseOver={(e) => (e.target.style.backgroundColor = "#143c23ff")} 
  onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}>Create Listing</button>
      </form>
    </div>
  </div>);
}

