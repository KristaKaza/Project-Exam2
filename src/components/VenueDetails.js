import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Row, Col } from "react-bootstrap";

import "../index.css";

function VenueDetails() {
  const { id } = useParams();
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
        setVenue(data?.data || {});
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
      <div className="venue-loading-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!venue) {
    return <p className="text-center">Venue details not available.</p>;
  }

  return (
    <Container className="venue-details-container">
      {/* Venue Image */}
      {venue.media && venue.media.length > 0 && (
        <div className="text-center mb-4">
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="img-fluid rounded venue-image"
          />
        </div>
      )}

      {/* Venue Details */}
      <div className="venue-details">
        <h2>{venue.name}</h2>
        <p>{venue.description}</p>

        {/* Details and Amenities Side by Side */}
        <Row className="mt-4">
          {/* Details Column */}
          <Col md={6} className="details-column border-end pe-4">
            <h4>Details</h4>
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
          </Col>

          {/* Amenities Column */}
          <Col md={6} className="amenities-column ps-4">
            {venue.meta && (
              <>
                <h4>Amenities</h4>
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
              </>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default VenueDetails;
