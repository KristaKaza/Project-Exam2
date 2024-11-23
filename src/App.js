import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import VenueGrid from "./components/VenueGrid";
import VenueDetails from "./components/VenueDetails";
import SearchResults from "./components/SearchResults";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProfilePage from "./components/ProfilePage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<VenueGrid />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile/:email" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
