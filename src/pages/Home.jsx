// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Home() {
//   const { user } = useAuth();

//   return (
//     <div style={{ textAlign: "center", marginTop: "5em",fontSize:40 }}>
//       <h1 style={{color:"#1f3471ff"}}> Welcome to ReBooked</h1>
//       <p>A platform for students to buy, sell, and exchange books easily.</p>

// {user && (
//   <div>
//     <Link to="/dashboard">
//       <button style={{ padding: "10px 20px", fontSize: "16px" }}>
//         Go to Dashboard
//       </button>
//     </Link>
//   </div>
// )}

//     </div>
//   );
// }
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const containerStyle = {
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    fontFamily: "'Dancing Script', cursive",
    backgroundImage: `url("/background.jpg.png")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingTop: "8vh",
    position: "relative",
  };

  const headingStyle = {
    fontSize: "7rem", // even bigger
    fontFamily: "'Pacifico', cursive",
    fontWeight: "900", // thicker
    color: "#001f3f", // Dark Navya Blue
    textShadow: "4px 4px 10px rgba(0,0,0,0.7)",
    marginBottom: "0.5em",
  };

  const sublineStyle = {
    fontSize: "3rem", // bigger than before
    fontFamily: "'Dancing Script', cursive",
    fontWeight: "700", // slightly lighter than header
    color: "#0a0a0a", // Navya Black
    textShadow: "2px 2px 6px rgba(0,0,0,0.4)",
    marginBottom: "2em",
  };

  const buttonStyle = {
    padding: "14px 28px",
    fontSize: "1.3rem",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#ff6f61",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome to ReBooked</h1>
      <p style={sublineStyle}>A platform for students to buy, sell, and exchange books easily.</p>

      {user && (
        <Link to="/dashboard">
          <button
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Go to Dashboard
          </button>
        </Link>
      )}
    </div>
  );
}
