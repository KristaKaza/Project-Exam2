import React, { useState, useEffect } from "react";
import AvailableDatesCalendar from "./AvailableDatesCalendar";
import { Container, Spinner, Alert } from "react-bootstrap";

const CreateBookingPage = ({ id }) => {
  const [venue, setVenue] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch venue details");

        const data = await response.json();
        console.log("API Response Data:", data?.data); // Check the structure of the response

        // Extract bookings and calculate booked dates
        const bookings = data?.data?.bookings || [];
        console.log("Bookings Data:", bookings); // Check if bookings data exists and is an array

        const bookedDates = bookings
          .map((booking) => {
            const startDate = booking.dateFrom.split("T")[0]; // Only the date part (YYYY-MM-DD)
            const endDate = booking.dateTo.split("T")[0]; // Only the date part (YYYY-MM-DD)
            let dates = [];
            for (
              let d = new Date(startDate);
              d <= new Date(endDate);
              d.setDate(d.getDate() + 1)
            ) {
              dates.push(d.toISOString().split("T")[0]); // Push as "YYYY-MM-DD"
            }
            return dates;
          })
          .flat();

        console.log("Booked Dates:", bookedDates); // Check the booked dates array

        // Generate the list of available dates (next 365 days)
        const allDates = Array.from({ length: 365 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          return date.toISOString().split("T")[0]; // Only the date part (YYYY-MM-DD)
        });

        // Filter out the booked dates
        const availableDates = allDates.filter(
          (date) => !bookedDates.includes(date)
        );

        console.log("Available Dates:", availableDates); // Check if available dates are populated

        setAvailableDates(availableDates); // Set the available dates
        setVenue(data?.data); // Set the venue data
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <h3>Loading venue...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Book Venue: {venue?.name}</h2>
      <p>{venue?.description}</p>

      <div className="mt-5">
        <h3>Available Dates</h3>
        {availableDates.length > 0 ? (
          <AvailableDatesCalendar
            availableDates={availableDates}
            onDateSelect={(date) => console.log("Selected Date:", date)}
          />
        ) : (
          <Alert variant="info">No available dates for this venue.</Alert>
        )}
      </div>
    </Container>
  );
};

export default CreateBookingPage;
