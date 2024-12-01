const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchAllVenues() {
  try {
    const response = await fetch(`${BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
}
