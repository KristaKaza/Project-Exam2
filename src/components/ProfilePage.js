import React, { useState, useEffect } from "react";
import { Container, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useBookings from "../components/useBookings"; // Import the custom hook

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const apiKey = "54591ad8-bc68-40ff-81e8-210109eadd6d";

  // Get the user object from localStorage and extract the token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}`,
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
          setError(errorData.errors?.[0]?.message || "Failed to load profile.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProfileData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username, token]);

  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useBookings(username, token, apiKey);

  if (loading || bookingsLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <h3>Loading profile...</h3>
      </Container>
    );
  }

  if (error || bookingsError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || bookingsError}</Alert>
      </Container>
    );
  }

  // Destructure profile data
  const {
    name,
    avatar,
    bio,
    venueManager,
    _count: { venues },
  } = profileData;

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          {/* Profile Image */}
          {avatar?.url ? (
            <img src={avatar.url} alt={avatar.alt || name} width="100%" />
          ) : (
            <p>No avatar available</p>
          )}
        </Col>
        <Col md={8}>
          <h2>{name}'s Profile</h2>
          <h4>Role: {venueManager ? "Venue Manager" : "Customer"}</h4>
          <p>Bio: {bio || "No bio available"}</p>

          {/* Display venues count */}
          <h5>Venues: {venues > 0 ? venues : "No venues available"}</h5>

          {/* Optional: List venues if they exist */}
          {venues > 0 && (
            <div>
              <p>List of venues goes here...</p>
            </div>
          )}

          {/* Display Bookings */}
          {bookings.length > 0 ? (
            <div>
              <h5>Bookings:</h5>
              <ul>
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    {booking.dateFrom} to {booking.dateTo} (Guests:{" "}
                    {booking.guests})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No bookings available</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
