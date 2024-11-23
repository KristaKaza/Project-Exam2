// src/hooks/useBookings.js
import { useState, useEffect } from "react";

const useBookings = (username, token, apiKey) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return; // If no username, return

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}/bookings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(
            errorData.errors?.[0]?.message || "Failed to load bookings."
          );
          setLoading(false);
          return;
        }

        const data = await response.json();
        setBookings(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [username, token, apiKey]);

  return { bookings, loading, error };
};

export default useBookings;
