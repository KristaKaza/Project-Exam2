import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found, please log in again");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": "4c554a4a-a9ba-4f52-9b48-563e778b98a2",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setProfile(data.data);
        } else {
          console.error("Error fetching profile:", data);
          setError(data.errors?.[0]?.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("An error occurred while fetching the profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  useEffect(() => {
    const fetchVenues = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found, please log in again");
        return;
      }

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}/venues?_owner=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": "4c554a4a-a9ba-4f52-9b48-563e778b98a2",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log("Fetched User Venues:", data); // Debugging the response
          setVenues(data.data || []); // Use the correct array
        } else {
          console.error("Error fetching venues:", data);
          setError("Failed to fetch venues.");
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
        setError("An error occurred while fetching venues.");
      }
    };

    fetchVenues();
  }, [username]);

  if (loading) {
    return (
      <Container>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Alert variant="warning">Profile not found or unauthorized</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1>{profile.name}'s Profile</h1>
      <img
        src={profile.avatar?.url}
        alt={profile.avatar?.alt || "Avatar"}
        width="200"
      />
      <p>
        <Link to={`/update-profile/${username}`} className="btn btn-secondary">
          Update profile
        </Link>
      </p>
      <img
        src={profile.banner?.url}
        alt={profile.banner?.alt || "Banner"}
        width="100%"
      />
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Bio:</strong> {profile.bio || "No bio provided"}
      </p>
      <p>
        <strong>Venue Manager:</strong> {profile.venueManager ? "Yes" : "No"}
      </p>
      <p>
        <strong>Bookings:</strong> {profile._count.bookings}
      </p>

      <h2>Your Venues</h2>
      {venues.length === 0 ? (
        <p>You haven't created any venues yet.</p>
      ) : (
        <div className="d-flex flex-wrap">
          {venues.map((venue) => (
            <Card key={venue.id} className="m-3" style={{ width: "18rem" }}>
              <Card.Img
                variant="top"
                src={venue.media?.[0]?.url || "placeholder.jpg"}
              />
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>{venue.description}</Card.Text>
                <Card.Text>
                  <strong>Price:</strong> ${venue.price}
                </Card.Text>
                <Card.Text>
                  <strong>Max Guests:</strong> {venue.maxGuests}
                </Card.Text>
                <Link to={`/venue/${venue.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ProfilePage;
