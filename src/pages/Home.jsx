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
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Dancing Script', cursive",
    backgroundImage: `url("/background.jpg.png")`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundColor: "#111827",
    position: "relative",
  };

  const buttonContainerStyle = {
    position: "absolute",
    top: "50%", // vertical center
    left: "47%", // 👈 moved slightly left (adjust this value)
    transform: "translate(-50%, -50%)",
  };

  const buttonStyle = {
    padding: "16px 36px",
    fontSize: "1.4rem",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#ff6f61",
    color: "#111827",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  };

  return (
    <div style={containerStyle}>
      {user && (
        <div style={buttonContainerStyle}>
          <Link to="/dashboard">
            <button
              style={buttonStyle}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              Go to Dashboard
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
