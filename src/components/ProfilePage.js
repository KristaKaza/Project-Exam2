import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found, please log in again");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": "b61fd6a4-7084-485e-8368-40fa2e08e36e",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setProfile(data.data);
        } else {
          console.error("Error fetching profile:", data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Error: Profile not found or unauthorized</div>;
  }

  return (
    <div>
      <h1>{profile.name}'s Profile</h1>
      <img src={profile.avatar.url} alt={profile.avatar.alt} width="200" />
      <p>
        <Link
          to={{
            pathname: `/update-profile/${username}`,
            state: { profile }, // Pass the fetched profile data to the UpdateProfileForm
          }}
        >
          Update profile
        </Link>
      </p>
      <img src={profile.banner.url} alt={profile.banner.alt} width="100%" />
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
    </div>
  );
};

export default ProfilePage;
