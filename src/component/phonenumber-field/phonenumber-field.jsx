"use client";

import React from "react";

import { Box, FormHelperText } from "@mui/material";
import MuiPhoneNumber from "mui-phone-number";

function PhoneNumberField({ label, handleInput, name, value, error = "", ...props }) {
  const handleChange = (e) => {
    const cleanedValue = e.replace(/[()\s-]/g, "");
    handleInput({
      target: {
        name,
        value: cleanedValue,
      },
    });
  };

  const PrintError = () => {
    if (error !== "") {
      return <FormHelperText sx={{ color: "red", mt: "0 !important" }}>{error}</FormHelperText>;
    }
  };

  return (
    <Box width="100%">
      <MuiPhoneNumber
        defaultCountry={"us"}
        label={label}
        onChange={handleChange}
        InputLabelProps={{ style: { fontSize: "1rem" } }}
        error={Boolean(error !== "")}
        value={value || ""}
        fullWidth
        {...props}
      />
      <PrintError />
    </Box>
  );
}

export default PhoneNumberField;
