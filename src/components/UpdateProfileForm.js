import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const UpdateProfileForm = () => {
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [error, setError] = useState("");

  const name = JSON.parse(localStorage.getItem("user"))?.name;
  const token = localStorage.getItem("authToken");

  if (!name || !token) {
    alert("You must be logged in to update your profile.");
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      bio,
      avatar: {
        url: avatarUrl,
        alt: "User avatar",
      },
      banner: {
        url: bannerUrl,
        alt: "User banner",
      },
      venueManager,
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": "b61fd6a4-7084-485e-8368-40fa2e08e36e",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      setError("An error occurred while updating your profile.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Update Your Profile</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="bio" className="mb-4">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Update your bio"
          />
        </Form.Group>

        <Form.Group controlId="avatarUrl" className="mb-4">
          <Form.Label>Avatar URL</Form.Label>
          <Form.Control
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Enter a URL for your avatar image"
          />
        </Form.Group>

        <Form.Group controlId="bannerUrl" className="mb-4">
          <Form.Label>Banner URL</Form.Label>
          <Form.Control
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="Enter a URL for your banner image"
          />
        </Form.Group>

        <Form.Group controlId="venueManager" className="mb-4">
          <Form.Check
            type="checkbox"
            label="Venue Manager"
            checked={venueManager}
            onChange={() => setVenueManager(!venueManager)}
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-50">
            Update Profile
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UpdateProfileForm;
