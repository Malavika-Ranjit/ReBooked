import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">About ReBooked</h1>
      <p className="about-subtitle">
        ReBooked is a web platform that helps college students buy, sell, or trade
        academic books within their campus. It promotes sustainability and reduces
        textbook costs by offering a centralized space for second-hand listings.
      </p>

      <div className="about-card">
        <h2 className="about-card-title">Features</h2>
        <p className="about-card-text">
          Users can securely register, add book details including title, author,
          course, condition, price, and image, and search or filter listings in real time.
        </p>
      </div>

      <div className="about-card">
        <h2 className="about-card-title">Technology</h2>
        <p className="about-card-text">
          Built with React.js and Supabase, ReBooked ensures smooth navigation
          and session management using React Context API and hooks.
        </p>
      </div>

      <div className="about-card">
        <h2 className="about-card-title">Our Mission</h2>
        <p className="about-card-text">
          To make textbook exchange easy, affordable, and sustainable for students,
          while creating a secure and efficient campus marketplace.
        </p>
      </div>
    </div>
  );
}
