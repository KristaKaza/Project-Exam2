import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";

function VenueDetails() {
  const { id } = useParams(); // Get venue ID from URL
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch venue details");

        const data = await response.json();
        setVenue(data?.data || {}); // Use the `data` property from API response
      } catch (error) {
        console.error("Error fetching venue:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!venue) {
    return <p className="text-center">Venue details not available.</p>;
  }

  return (
    <Container className="my-5">
      <Card style={{ borderRadius: "8px", overflow: "hidden" }}>
        {venue.media && venue.media.length > 0 && (
          <Card.Img
            variant="top"
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        )}
        <Card.Body>
          <Card.Title>{venue.name}</Card.Title>
          <Card.Text>{venue.description}</Card.Text>
          <ul>
            <li>
              <strong>Price:</strong> ${venue.price}
            </li>
            <li>
              <strong>Max Guests:</strong> {venue.maxGuests}
            </li>
            <li>
              <strong>Location:</strong> {venue.location?.city || "N/A"},{" "}
              {venue.location?.country || "N/A"}
            </li>
            <li>
              <strong>Rating:</strong> {venue.rating}
            </li>
          </ul>
          {venue.meta && (
            <ul>
              <li>
                <strong>WiFi:</strong>{" "}
                {venue.meta.wifi ? "Available" : "Not available"}
              </li>
              <li>
                <strong>Parking:</strong>{" "}
                {venue.meta.parking ? "Available" : "Not available"}
              </li>
              <li>
                <strong>Breakfast:</strong>{" "}
                {venue.meta.breakfast ? "Available" : "Not available"}
              </li>
              <li>
                <strong>Pets:</strong>{" "}
                {venue.meta.pets ? "Allowed" : "Not allowed"}
              </li>
            </ul>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default VenueDetails;
