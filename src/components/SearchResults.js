import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

const fetchSearchResults = async (query) => {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("API fetch error:", error);
    return [];
  }
};

const SearchResults = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const getVenues = async () => {
      setLoading(true);
      try {
        const data = await fetchSearchResults(query);
        setVenues(data);
        setError(null);
      } catch (error) {
        setError("Error fetching venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      getVenues();
    }
  }, [query]);

  if (loading) {
    return (
      <Container>
        <p className="text-center">Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p className="text-center text-danger">{error}</p>
      </Container>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <Container>
        <p className="text-center">No venues found for "{query}"</p>
      </Container>
    );
  }

  const handleCardClick = (id) => {
    navigate(`/venue/${id}`);
  };

  return (
    <Container>
      <h2 className="text-center my-4">Search Results for "{query}"</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {venues.map((venue) => (
          <Col key={venue.id}>
            <Card
              className="h-100 clickable-card"
              onClick={() => handleCardClick(venue.id)} // Handle card click
            >
              <Card.Img
                variant="top"
                src={
                  venue.media && venue.media[0]
                    ? venue.media[0].url
                    : "https://via.placeholder.com/300"
                }
                alt={
                  venue.media && venue.media[0]?.alt
                    ? venue.media[0]?.alt
                    : venue.name
                }
                className="img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>{venue.description}</Card.Text>
                <Card.Text>
                  <strong>Price:</strong> ${venue.price}
                </Card.Text>
                <Card.Text>
                  <strong>Location:</strong> {venue.location?.city || "N/A"},{" "}
                  {venue.location?.country || "N/A"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchResults;
