import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1> Welcome to ReBooked</h1>
      <p>A platform for students to buy, sell, and exchange books easily.</p>

      {!user ? (
        <div>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/register"><button>Register</button></Link>
          <Link to="/about"><button>About</button></Link>
        </div>
      ) : (
        <div>
          <Link to="/dashboard"><button>Go to Dashboard</button></Link>
        </div>
      )}
    </div>
  );
}
