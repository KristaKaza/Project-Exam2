import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreateVenuePage() {
  const [venueName, setVenueName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [price, setPrice] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);
  const [rating, setRating] = useState(0);
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Get user data from localStorage to get the accessToken
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!venueName || !description || !price || !maxGuests) {
      setError("Name, description, price, and max guests are required.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.accessToken;

    if (!token) {
      console.error("No token found, redirecting to login...");
      navigate("/login");
      return;
    }

    setError("");
    setSuccess("");

    const requestBody = {
      name: venueName.trim(),
      description: description.trim(),
      media: mediaUrl
        ? [
            {
              url: mediaUrl.trim(),
              alt: mediaAlt.trim() || "Venue image",
            },
          ]
        : [],
      price: parseFloat(price),
      maxGuests: parseInt(maxGuests),
      rating: parseFloat(rating) || 0,
      meta: {
        wifi,
        parking,
        breakfast,
        pets,
      },
      location: {
        address: address.trim() || null,
        city: city.trim() || null,
        zip: zip.trim() || null,
        country: country.trim() || null,
        continent: continent.trim() || null,
      },
    };

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/venues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.errors?.[0]?.message || "Failed to create venue.");
        return;
      }

      setSuccess("Venue created successfully!");
      setTimeout(() => navigate("/profile/" + user.name), 2000);
    } catch (error) {
      console.error("Error creating venue:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create Venue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formVenueName" className="mb-3">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter venue name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter venue description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formMediaUrl" className="mb-3">
          <Form.Label>Media URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter media URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formMediaAlt" className="mb-3">
          <Form.Label>Media Alt Text</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter media alt text"
            value={mediaAlt}
            onChange={(e) => setMediaAlt(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPrice" className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formMaxGuests" className="mb-3">
          <Form.Label>Max Guests</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter max guests"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formRating" className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter rating (optional)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="WiFi"
            checked={wifi}
            onChange={(e) => setWifi(e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Parking"
            checked={parking}
            onChange={(e) => setParking(e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Breakfast"
            checked={breakfast}
            onChange={(e) => setBreakfast(e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Pets Allowed"
            checked={pets}
            onChange={(e) => setPets(e.target.checked)}
          />
        </Form.Group>

        <Form.Group controlId="formAddress" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formCity" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formZip" className="mb-3">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter zip code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formCountry" className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formContinent" className="mb-3">
          <Form.Label>Continent</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter continent"
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
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
