import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import VenueGrid from "./components/VenueGrid";
import VenueDetails from "./components/VenueDetails";
import SearchResults from "./components/SearchResults";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProfilePage from "./components/ProfilePage";
import CreateBookingPage from "./components/CreateBookingPage";
import ParentComponent from "./components/ParentComponent"; // Adjust path as necessary
import CreateVenuePage from "./components/CreateVenuePage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token on logout
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<VenueGrid />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        <Route path="/create-venue" element={<CreateVenuePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route
          path="/create-booking/:venueId"
          element={<CreateBookingPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
