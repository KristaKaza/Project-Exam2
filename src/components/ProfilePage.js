import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProfilePage() {
  const { username } = useParams(); // Extracting the username from the URL params
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure username exists in the URL
    if (!username) {
      setError("Username is required.");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      // If there's no token, redirect to login page
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/user/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Invalid authorization token") {
            localStorage.removeItem("authToken"); // Remove invalid token
            navigate("/login"); // Redirect to login
          } else {
            setError("Error loading profile data");
          }
          return;
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchProfileData();
  }, [username, navigate]);

  if (error) return <div>{error}</div>;
  if (!profileData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profileData.name}'s Profile</h1>
      <p>Email: {profileData.email}</p>
      <p>Role: {profileData.role}</p>
    </div>
  );
}

export default ProfilePage;
