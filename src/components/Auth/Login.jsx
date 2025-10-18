import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard"); // redirect after login
    }
  };

  return (
    <div  style={{
        height: "100vh", // full viewport height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e7edf0ff",
         // light background
      }}>
      <div style={{
          backgroundColor: "white",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          padding: "1.8rem",
          width: "30rem",
          textAlign: "center",
          transform: "translateY(-60px)",
          height:"50vh",
          paddingLeft:"2.5rem",
          paddingRight:"4rem"
        }}>
        <h2 style={{
            fontSize: "40px",
            fontWeight: "800",
            marginBottom: "24px",
            color: "#243f64ff", // dark text
          }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "16px",
              height:"4vh"
            }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "16px",
              height:"4vh"
            }}
          />
          <button type="submit"  style={{
              width: "50%",
              backgroundColor: "#1d3250ff",
              color: "white",
              padding: "10px 0",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              marginLeft:"125px",
            }}>
            Login
          </button>
          
        </form>
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "1.2rem",
            color: "#4b5563",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#4b648dff",
              fontWeight: "600",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Register
          </Link>
        </p>
       
      </div>
    </div>
  );
}
