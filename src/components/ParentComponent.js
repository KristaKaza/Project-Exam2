import React, { useState, useEffect } from "react";
import AvailableDatesCalendar from "./AvailableDatesCalendar";

const ParentComponent = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Simulate an API call to fetch available dates
    const fetchedAvailableDates = [
      new Date("2024-12-01"),
      new Date("2024-12-05"),
      new Date("2024-12-10"),
    ];

    console.log("Fetched Available Dates:", fetchedAvailableDates);

    setAvailableDates(fetchedAvailableDates);
  }, []);

  const handleDateSelect = (date) => {
    console.log("Selected Date:", date);
    setSelectedDate(date);
  };

  return (
    <div>
      <h1>Book Your Date</h1>
      <AvailableDatesCalendar
        availableDates={availableDates} // Ensure availableDates is passed here
        onDateSelect={handleDateSelect}
      />
    </div>
  );
};

export default ParentComponent;
