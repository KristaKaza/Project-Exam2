import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import VenueGrid from "./components/VenueGrid";
import VenueDetails from "./components/VenueDetails";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<VenueGrid />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        {/* Add additional routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
