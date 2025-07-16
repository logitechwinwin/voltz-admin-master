"use client";
import React from "react";

import { InputLabel, FormHelperText, TextField, FormControl, InputAdornment } from "@mui/material";

import Utils from "@/Utils";

const InputField = React.forwardRef(
  (
    {
      sx = {},
      labelTop = "",
      label = "",
      styles,
      error = "",
      helperText = "",
      icon,
      fullWidth = true,
      value: propsValue,
      onChange: propsOnChange,
      size = "Medium",
      min = "",
      max = "",
      ...props
    },
    ref
  ) => {
    const [stateValue, setStateValue] = React.useState("");
    const value = propsValue !== undefined ? propsValue : stateValue;
    const _id = `myInput__${Utils.generateId()}`;

    const onChange = (event) => {
      if (event?.target?.type === 'tel') {
        if (!/^[0-9]*$/.test(event.target.value)) {
          return
        }
        if (propsOnChange) {
          propsOnChange(event);
        } else {
          setStateValue(event.target.value);
        }
      } else {
        if (propsOnChange) {
          propsOnChange(event);
        } else {

          setStateValue(event.target.value);
        }
      }
    };


    const printHelperText = () => {
      if (helperText !== "") {
        return (
          <FormHelperText
            sx={{
              mt: "0 !important",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#6C6A6A",
              fontWeight: 500,
              mx: 0,
            }}
          >
            {helperText}
            {icon}
          </FormHelperText>
        );
      }
    };

    return (
      <FormControl sx={styles} fullWidth={fullWidth}>
        {labelTop && (
          <InputLabel
            htmlFor={_id}
            sx={{
              marginBottom: "5px",
              color: "#000",
            }}
          >
            {labelTop}
          </InputLabel>
        )}
        <TextField
          id={_id}
          inputRef={ref}
          sx={{
            ...sx,
            "& input[type=number]": {
              "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                margin: 0,
              },
            },
          }}
          error={Boolean(error !== "")}
          label={label}
          fullWidth={fullWidth}
          size={size}
          autoComplete="off"
          value={value}
          onChange={onChange}
          helperText={error}
          inputProps={{
            min: min,
            maxLength: max,
          }}
          {...props}
        />
        {printHelperText()}
      </FormControl>
    );
  }
);
InputField.displayName = "InputField";
export default InputField;
