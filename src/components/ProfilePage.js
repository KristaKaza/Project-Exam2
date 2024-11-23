import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.role === "Venue Manager") {
      // Fetch venues owned by the user
      fetch(`https://v2.api.noroff.dev/venues?owner=${email}`)
        .then((response) => response.json())
        .then((data) => setVenues(data))
        .catch((err) => setError("Failed to fetch venues"));
    }
  }, [email, user]);

  useEffect(() => {
    if (!user || user.email !== email) {
      navigate("/login");
    }
  }, [user, email, navigate]);

  return (
    <Container className="mt-5">
      <h2>Welcome, {user?.email}</h2>
      <p>Role: {user?.role}</p>
      {error && <p className="text-danger">{error}</p>}

      {user?.role === "Venue Manager" && (
        <>
          <h3>Your Venues</h3>
          {venues.length > 0 ? (
            venues.map((venue) => (
              <Card key={venue.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{venue.name}</Card.Title>
                  <Card.Text>{venue.description}</Card.Text>
                  <Button variant="primary" href={`/venue/${venue.id}`}>
                    View Venue
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>You have no venues yet.</p>
          )}
        </>
      )}
      <Button
        variant="danger"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/");
        }}
      >
        Logout
      </Button>
    </Container>
  );
}

export default ProfilePage;
