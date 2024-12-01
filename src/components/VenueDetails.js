import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Spinner,
  Row,
  Col,
  Button,
  Modal,
  Alert,
  Form,
} from "react-bootstrap";
import AvailableDatesCalendar from "./AvailableDatesCalendar";
import "../index.css";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const [error, setError] = useState(null);
  const [isVenueManager, setIsVenueManager] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchVenue = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch venue details");

        const data = await response.json();

        setVenue(data?.data || {});
        setAvailableDates(data?.data?.availableDates || []);

        if (data?.data?._owner?.username === user?.name) {
          setIsVenueManager(true);
        } else {
          setIsVenueManager(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id, user]);

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

    const bookingData = {
      dateFrom,
      dateTo,
      guests,
      venueId: id,
    };

    const authToken = localStorage.getItem("authToken");

    console.log("Auth Token:", authToken);

    if (!authToken) {
      setBookingStatus("You must be logged in to make a booking.");
      return;
    }

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "X-Noroff-API-Key": "4c554a4a-a9ba-4f52-9b48-563e778b98a2",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (response.ok) {
        setBookingStatus("Booking successful!");
      } else {
        setBookingStatus("Failed to create booking.");
      }
    } catch (error) {
      setBookingStatus("An error occurred while making the booking.");
      console.error("Error submitting booking:", error);
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

      <Row>
        <Col md={6}>
          <p>
            <strong>Price:</strong> ${venue?.price}
          </p>
          <p>
            <strong>Max Guests:</strong> {venue?.maxGuests}
          </p>
          <p>
            <strong>Rating:</strong> {venue?.rating} / 5
          </p>
        </Col>
        <Col md={6}>
          <p>
            <strong>Location:</strong>
          </p>
          <ul>
            <li>{venue?.location?.address}</li>
            <li>{venue?.location?.city}</li>
            <li>{venue?.location?.zip}</li>
            <li>{venue?.location?.country}</li>
            <li>{venue?.location?.continent}</li>
          </ul>
        </Col>
      </Row>

      <h3>Facilities</h3>
      <ul>
        {venue?.meta?.wifi && <li>Wi-Fi: Available</li>}
        {venue?.meta?.parking && <li>Parking: Available</li>}
        {venue?.meta?.breakfast && <li>Breakfast: Included</li>}
        {venue?.meta?.pets && <li>Pets: Allowed</li>}
      </ul>

      <Button variant="primary" onClick={handleBookHere}>
        Book Here
      </Button>

      {isVenueManager && (
        <Link to={`/update-venue/${venue?.id}`}>
          <Button variant="secondary" className="mt-3">
            Update Venue
          </Button>
        </Link>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book {venue?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Select Dates:</h5>
          <AvailableDatesCalendar
            availableDates={availableDates}
            onDateSelect={(startDate, endDate) => {
              setDateFrom(startDate);
              setDateTo(endDate || startDate);
            }}
          />
          <Form.Group controlId="formGuests">
            <Form.Label>Number of Guests</Form.Label>
            <Form.Control
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
            />
          </Form.Group>
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
