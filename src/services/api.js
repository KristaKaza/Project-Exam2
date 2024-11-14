const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchAllVenues() {
  try {
    const response = await fetch(`${BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }
    const data = await response.json();
    console.log("API response data:", data); // Verify the structure of the response
    return data.data; // Access the array of venues inside the `data` field
  } catch (error) {
    console.error("Error fetching venues:", error);
    return []; // Return an empty array if there's an error
  }
}
