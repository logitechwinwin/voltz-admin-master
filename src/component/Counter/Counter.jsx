/* eslint-disable no-unused-vars */
"use client";
import React, { useState } from "react";

import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";

import { AddIcon, RemoveIcon } from "@/assets";

const Counter = ({ hours, setHours }) => {
  const handleMinusCounter = () => {
    if (hours > 1) {
      setHours((prev) => prev - 1);
    }
  };
  const handlePlusCounter = () => {
    if (hours < 1000) {
      setHours((prev) => +prev + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Ensure the value is an integer and greater than or equal to 1
    if (
      value === "" ||
      (Number.isInteger(Number(value)) && parseInt(value) > 0)
    ) {
      setHours(parseInt(value) || 1);
    }
  };

  return (
    <Stack
      direction="row"
      gap={0}
      sx={{
        "& .MuiInputBase-root": {
          borderRadius: "0px",
          textAlign: "center",
        },
      }}
    >
      <IconButton sx={Style.iconButton} onClick={handleMinusCounter}>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            ...Style.button,
            borderRight: "0px",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
          color="#06B0BA"
        >
          <RemoveIcon />
        </Stack>
      </IconButton>
      <TextField
        value={hours}
        onChange={handleInputChange}
        size="small"
        type="number"
        sx={Style.textField}
        inputProps={{ min: 1, step: 1 }}
      />
      <IconButton sx={Style.iconButton} onClick={handlePlusCounter}>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            ...Style.button,
            borderLeft: "0px",
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
          }}
          color="#06B0BA"
        >
          <AddIcon />
        </Stack>
      </IconButton>
    </Stack>
  );
};

export default Counter;

const Style = {
  button: {
    border: "1px solid #c4c4c4",
    height: "100%",
    cursor: "pointer",
    px: 1,
  },
  textField: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
    "& .MuiInputBase-input": {
      textAlign: "center",
    },
  },
  iconButton: { padding: 0, borderRadius: "0px" },
};
