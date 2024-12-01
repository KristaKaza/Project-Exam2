const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchAllVenues() {
  try {
    const response = await fetch(`${BASE_URL}/venues`);

    // Check if the response is JSON, or handle errors
    const contentType = response.headers.get("Content-Type");
    if (!response.ok) {
      throw new Error(`Failed to fetch venues, status: ${response.status}`);
    }
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Expected JSON response, but got HTML instead.");
    }

    const data = await response.json();
    console.log("API response data:", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
}
