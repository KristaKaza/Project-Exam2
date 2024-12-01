import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UpdateProfileForm = ({ onUpdateProfile }) => {
  const location = useLocation();
  const currentUser = location.state?.profile;

  // Initialize state with default values and useEffect to update once currentUser is available
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [venueManager, setVenueManager] = useState(false);

  // Once currentUser is available, update state
  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio || "");
      setAvatarUrl(currentUser.avatar?.url || "");
      setBannerUrl(currentUser.banner?.url || "");
      setVenueManager(currentUser.venueManager || false);
    }
  }, [currentUser]);

  // Return loading state if currentUser is not available
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.name) {
      console.error("Error: currentUser is not defined or has no name");
      alert("Failed to update profile: currentUser data is invalid.");
      return;
    }

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
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${currentUser.name}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "b61fd6a4-7084-485e-8368-40fa2e08e36e",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      const data = await response.json();

      if (response.ok) {
        onUpdateProfile(data.data);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("An error occurred while updating your profile.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio:
          </label>
          <textarea
            id="bio"
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Update your bio"
            rows="4"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="avatarUrl" className="form-label">
            Avatar URL:
          </label>
          <input
            type="url"
            id="avatarUrl"
            className="form-control"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Enter a URL for your avatar image"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bannerUrl" className="form-label">
            Banner URL:
          </label>
          <input
            type="url"
            id="bannerUrl"
            className="form-control"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="Enter a URL for your banner image"
          />
        </div>

        <div className="mb-3 form-check">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              checked={venueManager}
              onChange={() => setVenueManager((prev) => !prev)}
            />
            Venue Manager
          </label>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-3">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
