import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: "5em",fontSize:40 }}>
      <h1 style={{color:"#1f3471ff"}}> Welcome to ReBooked</h1>
      <p>A platform for students to buy, sell, and exchange books easily.</p>

{user && (
  <div>
    <Link to="/dashboard">
      <button style={{ padding: "10px 20px", fontSize: "16px" }}>
        Go to Dashboard
      </button>
    </Link>
  </div>
)}

    </div>
  );
}
