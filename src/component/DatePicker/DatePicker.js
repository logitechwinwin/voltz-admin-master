/* eslint-disable no-unused-vars */
import React from "react";

import { useMediaQuery } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const DatePicker = React.forwardRef(
  ({ type = "date", value, label, maxDate, variant = "outlined", error, onChange, name, required, textFieldProp, ...props }, ref) => {
    const matches = useMediaQuery("(min-width:1000px)");

    const size = matches ? "large" : "small";
    let Picker;
    switch (type) {
      case "datetime":
        Picker = DateTimePicker;
        break;
      case "time":
        Picker = TimePicker;
        break;
      default:
        Picker = MuiDatePicker;
        break;
    }

    const handleChange = (value) => {
      const data = {
        target: {
          name,
          value: value,
        },
      };
      onChange(data);
    };

    return (
      <Picker
        inputRef={ref}
        value={value || null}
        label={label}
        desktopModeMediaQuery="(min-width: 0px)" // Force desktop mode
        onChange={(e) => {
          handleChange(e);
        }}
        minutesStep={5}
        // minDate={minDate}
        maxDate={maxDate}
        // minTime={minTime}
        // maxTime={maxTime}
        slotProps={{
          textField: {
            variant,
            helperText: error,
            error: Boolean(error),
            fullWidth: true,
            required,
            ...textFieldProp,
            // size: size,
          },
        }}
        {...props}
      />
    );
  }
);
DatePicker.displayName = "DatePicker";
export default DatePicker;
