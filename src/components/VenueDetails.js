import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import AvailableDatesCalendar from "./AvailableDatesCalendar"; // Assuming AvailableDatesCalendar.js is in the same directory
import "../index.css";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch venue details");

        const data = await response.json();
        setVenue(data?.data || {});
        setAvailableDates(data?.data?.availableDates || []);
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  const handleBookHere = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setBookingStatus("");
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!dateFrom || !dateTo) {
      setBookingStatus("Please select both start and end dates.");
      return;
    }

    // Create a new booking with the selected dates
    const bookingData = {
      dateFrom,
      dateTo,
      guests: 1, // Update this with actual guest number if needed
      venueId: id,
    };

    // Call the API to create the booking (example of POST request)
    const response = await fetch("REACT_APP_API_BASE_URL/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });

    if (response.ok) {
      setBookingStatus("Booking successful!");
    } else {
      setBookingStatus("Failed to create booking.");
    }
  };

  if (loading) {
    return (
      <div className="venue-loading-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="venue-details-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="venue-details-container">
      <div className="text-center mb-4">
        <img
          src={venue?.media?.[0]?.url}
          alt={venue?.name}
          className="img-fluid rounded venue-image"
        />
      </div>

      <h2>{venue?.name}</h2>
      <p>{venue?.description}</p>

      <Button variant="primary" onClick={handleBookHere}>
        Book Here
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book {venue?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Select Dates:</h5>
          {/* Pass available dates to the calendar */}
          <AvailableDatesCalendar
            availableDates={availableDates}
            onDateSelect={(date) => {
              setDateFrom(date);
              setDateTo(date);
            }}
          />
          {bookingStatus && <Alert variant="info">{bookingStatus}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitBooking}>
            Submit Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default VenueDetails;
