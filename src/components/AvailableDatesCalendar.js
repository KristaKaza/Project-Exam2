import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AvailableDatesCalendar = ({ availableDates, onDateSelect }) => {
  // Log the available dates to confirm they're being passed correctly
  console.log("Available Dates Passed to Calendar:", availableDates);

  // Modified comparison to ensure correct date selection (ignores time part)
  const isDateAvailable = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Only compare date part (YYYY-MM-DD)
    return availableDates.includes(formattedDate); // Check if the date is available
  };

  console.log("Checking dates..."); // Debugging log for date checking

  return (
    <Calendar
      onClickDay={onDateSelect} // Callback function to handle date selection
      tileDisabled={({ date }) => !isDateAvailable(date)} // Disable unavailable dates
    />
  );
};

export default AvailableDatesCalendar;
