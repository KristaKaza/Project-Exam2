import React, { useEffect, useState } from "react";
import { fetchVenues } from "./services/api";

function App() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    async function getVenues() {
      const data = await fetchVenues();
      setVenues(data);
    }
    getVenues();
  }, []);

  return (
    <div className="App container">
      <h1 className="mt-5">Holidaze Venues</h1>
      <ul>
        {venues.length > 0 ? (
          venues.map((venue) => <li key={venue.id}>{venue.name}</li>)
        ) : (
          <p>Loading venues...</p>
        )}
      </ul>
    </div>
  );
}

export default App;
