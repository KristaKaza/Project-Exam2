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
import CreateVenuePage from "./components/CreateVenuePage";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfileForm from "./components/UpdateProfileForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<VenueGrid />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        <Route path="/create-venue" element={<CreateVenuePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/login"
          element={<LoginForm setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<RegisterForm />} />

        {/* Update Profile Page */}
        <Route
          path="/update-profile/:username"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UpdateProfileForm />
            </ProtectedRoute>
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-booking/:venueId"
          element={<CreateBookingPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
