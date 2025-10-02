import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    //if (user) {
     // await supabase.from("users").insert([
      //  { user_id: user.id, name: name, email: email }
     // ]);

     // if (insertError) {
     // console.error("Error inserting into users:", insertError.message);
     // alert("Database insert failed: " + insertError.message);
     // }
   // }

    //alert("Signup successful! Check your email to confirm.");
    //navigate("/dashboard"); // redirect after signup

    if (user) {
    // ✅ FIX: properly capture insertError
    const { error: insertError } = await supabase.from("users").insert([
      { user_id: user.id, name, email }
    ]);

    if (insertError) {
      console.error("Error inserting into users:", insertError.message);
      alert("Database insert failed: " + insertError.message);
    }
  }

  // ✅ FIX: redirect only if session exists (since you disabled email confirmation, it will exist)
  if (data.session) {
    navigate("/dashboard");
  }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
