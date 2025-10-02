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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a listing.");
      return;
    }

    // Step 1: Check if book exists
    const { data: existingBooks } = await supabase
      .from("books")
      .select("book_id")
      .eq("title", title)
      .eq("author", author)
      .limit(1);

    let bookId;

    // Step 2: Insert book if not exists
    if (existingBooks && existingBooks.length > 0) {
      bookId = existingBooks[0].book_id;
    } else {
      const { data: newBook, error: insertBookError } = await supabase
        .from("books")
        .insert([{ title, author, course }])
        .select("book_id")
        .single();

      if (insertBookError) {
        console.error(insertBookError);
        alert("Error adding book: " + insertBookError.message);
        return;
      }

      bookId = newBook.book_id;
    }

    // Step 3: Insert listing (status = "Available" by default)
    const { error: listingError } = await supabase.from("listings").insert([
      {
        user_id: user.id,
        book_id: bookId,
        price,
        status: "Available",
      },
    ]);

    if (listingError) {
      console.error(listingError);
      alert("Error creating listing: " + listingError.message);
    } else {
      alert("Listing created successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">➕ Create Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Course (optional)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}
