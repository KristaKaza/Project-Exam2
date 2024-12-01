import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreateVenuePage() {
  const [venueName, setVenueName] = useState(""); // Renamed from 'name' to 'venueName'
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);
  const [rating, setRating] = useState(0); // Optional state
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState(""); // Added to state
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);
  const [locationAddress, setLocationAddress] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationZip, setLocationZip] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken"); // Moved declaration here

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!venueName || !description || price <= 0 || maxGuests <= 0) {
      setError(
        "Name, description, price, and max guests are required and must be valid."
      );
      return;
    }

    const venueData = {
      name: venueName,
      description,
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating: Number(rating),
      media: mediaUrl && mediaAlt ? [{ url: mediaUrl, alt: mediaAlt }] : [],
      meta: { wifi, parking, breakfast, pets },
      location: {
        address: locationAddress || null,
        city: locationCity || null,
        zip: locationZip || null,
        country: locationCountry || null,
      },
    };

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/venues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Noroff-API-Key": "4c554a4a-a9ba-4f52-9b48-563e778b98a2",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(venueData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error creating venue:", responseData.errors);
        setError(
          responseData.errors?.[0]?.message || "Failed to create venue."
        );
        return;
      }

      console.log("Venue created:", responseData);
      navigate(`/venue/${responseData.data.id}`);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <h2>Create a Venue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="venueName" className="mb-3">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter venue name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter venue description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="price" className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </Form.Group>

        <Form.Group controlId="maxGuests" className="mb-3">
          <Form.Label>Max Guests</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter max guests"
            value={maxGuests}
            onChange={(e) => setMaxGuests(Number(e.target.value))}
          />
        </Form.Group>

        <Form.Group controlId="rating" className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter rating (0-5)"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min={0}
            max={5}
          />
        </Form.Group>

        <Form.Group controlId="mediaUrl" className="mb-3">
          <Form.Label>Media URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="mediaAlt" className="mb-3">
          <Form.Label>Media Alt Text</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter alt text for image"
            value={mediaAlt}
            onChange={(e) => setMediaAlt(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="wifi" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Wifi"
            checked={wifi}
            onChange={() => setWifi(!wifi)}
          />
        </Form.Group>

        <Form.Group controlId="parking" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Parking"
            checked={parking}
            onChange={() => setParking(!parking)}
          />
        </Form.Group>

        <Form.Group controlId="breakfast" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Breakfast"
            checked={breakfast}
            onChange={() => setBreakfast(!breakfast)}
          />
        </Form.Group>

        <Form.Group controlId="pets" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Pets Allowed"
            checked={pets}
            onChange={() => setPets(!pets)}
          />
        </Form.Group>

        <Form.Group controlId="locationAddress" className="mb-3">
          <Form.Label>Location Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="locationCity" className="mb-3">
          <Form.Label>Location City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="locationZip" className="mb-3">
          <Form.Label>Location Zip Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter zip code"
            value={locationZip}
            onChange={(e) => setLocationZip(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="locationCountry" className="mb-3">
          <Form.Label>Location Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={locationCountry}
            onChange={(e) => setLocationCountry(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Venue
        </Button>
      </Form>
    </Container>
  );
}

export default CreateVenuePage;
