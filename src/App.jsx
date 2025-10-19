import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import Transactions from "./pages/Transactions";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/mylistings" element={<MyListings />} />
      </Routes>
    </Router>
  );
}

export default App;
