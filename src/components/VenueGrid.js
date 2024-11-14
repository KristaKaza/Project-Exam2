import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllVenues } from "../services/api";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function VenueGrid() {
  const [venues, setVenues] = useState([]);
  const [visibleVenues, setVisibleVenues] = useState(9);

  useEffect(() => {
    async function getVenues() {
      const data = await fetchAllVenues();
      setVenues(Array.isArray(data) ? data : []);
    }
    getVenues();
  }, []);

  const handleLoadMore = () => {
    setVisibleVenues((prev) => prev + 9);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Explore Our Venues</h2>
      <Row>
        {venues.slice(0, visibleVenues).map((venue) => (
          <Col xs={12} sm={6} md={4} key={venue.id} className="mb-4">
            <Link
              to={`/venue/${venue.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card style={{ borderRadius: "8px", overflow: "hidden" }}>
                {venue.media && venue.media.length > 0 && (
                  <Card.Img
                    variant="top"
                    src={venue.media[0].url}
                    alt={venue.media[0].alt || venue.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{venue.name}</Card.Title>
                  <Card.Text>{venue.location.city}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {visibleVenues < venues.length && (
        <div className="text-center mt-4">
          <Button onClick={handleLoadMore} variant="primary">
            Load More
          </Button>
        </div>
      )}
    </Container>
  );
}

export default VenueGrid;
