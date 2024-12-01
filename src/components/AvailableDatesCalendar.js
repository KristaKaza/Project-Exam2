import React from "react";
import { Calendar } from "react-calendar"; // If you're using the react-calendar library
import "react-calendar/dist/Calendar.css"; // Make sure to import the styles

function AvailableDatesCalendar({ availableDates, onDateSelect }) {
  const availableDatesFormatted = availableDates.map((date) => new Date(date));

  const handleDateClick = (date) => {
    onDateSelect(date);
  };

  return (
    <div>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) => {
          return availableDatesFormatted.some(
            (availableDate) =>
              availableDate.toDateString() === date.toDateString()
          )
            ? "available"
            : "";
        }}
      />
    </div>
  );
}

export default AvailableDatesCalendar;
