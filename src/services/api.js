const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch venues list as a test
export async function fetchVenues() {
  try {
    const response = await fetch(`${BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
}
