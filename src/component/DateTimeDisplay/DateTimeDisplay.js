import React from "react";
import moment from "moment";

const DateTimeDisplay = ({ dateTime }) => {
  // Get the current date
  const today = moment().startOf("day");

  // Check if the given date is today
  const isToday = moment(dateTime).isSame(today, "day");

  // If today, show time only, else show date and time
  const display = isToday
    ? moment(dateTime).format("h:mm A") // Time format: 12-hour with AM/PM
    : moment(dateTime).format("MMM D, YYYY"); // Date and time format

  return <span>{display}</span>;
};

export default DateTimeDisplay;
