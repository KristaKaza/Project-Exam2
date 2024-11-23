import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

function ProfilePage() {
  const { email } = useParams();
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.email !== email) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    // Fetch user's venues if they are a Venue Manager
    if (storedUser.role === "Venue Manager") {
      fetch(`https://v2.api.noroff.dev/venues?owner=${email}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch venues.");
          }
          return response.json();
        })
        .then((data) => setVenues(data))
        .catch((err) => setError(err.message));
    }
  }, [email, navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.avatar && (
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="img-fluid rounded-circle mb-3"
          style={{ width: "150px" }}
        />
      )}

      {error && <p className="text-danger">{error}</p>}

      {user.role === "Venue Manager" && (
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
