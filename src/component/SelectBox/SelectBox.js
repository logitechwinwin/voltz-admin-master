/* eslint-disable no-unused-vars */
import React from "react";

import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, useMediaQuery } from "@mui/material";

import Utils from "@/Utils";

export default function SelectBox({
  labelTop,
  label,
  items = [],
  error = "",
  value: propsValue,
  styles = {},
  // size,
  name = "",
  onChange: propsOnChange,
  helperText,
  labelSx,
  defaultValue,
  isLoading,
  fullWidth = true,
  optionRenderKeys,
  ...props
}) {
  const [stateValue, setStateValue] = React.useState("");
  const value = propsValue !== undefined ? propsValue : stateValue;

  const matches = useMediaQuery("(min-width:1000px)");

  // const adjustSize = size ? size : matches ? "large" : "small";

  const onChange = (event) => {
    if (propsOnChange) {
      propsOnChange(event);
    } else {
      setStateValue(event.target.value);
    }
  };

  const _id = `select__${Utils.generateId()}`;

  return (
    <Box sx={{ ...styles }}>
      {labelTop && (
        <InputLabel
          htmlFor={_id}
          sx={{
            marginBottom: "5px",
            color: "#000",
            ...labelSx,
          }}
        >
          {labelTop}
        </InputLabel>
      )}
      <FormControl sx={{ minWidth: "150px" }} {...props} fullWidth error={error}>
        <InputLabel id={_id}>{label}</InputLabel>
        <Select id={_id} name={name} error={Boolean(error !== "")} value={value} onChange={onChange} defaultValue={defaultValue} label={label}>
          {items?.map((_v, _i) => {
            return (
              <MenuItem key={_i} value={_v[optionRenderKeys?.value]}>
                {_v[optionRenderKeys?.name]}
              </MenuItem>
            );
          })}

          {isLoading && (
            <Stack justifyContent="center" alignItems="center" width="100%" p={1}>
              <CircularProgress size="20" />
            </Stack>
          )}
          {!items.length && !isLoading && (
            <Stack justifyContent="center" alignItems="center" width="100%" p={1}>
              <FormHelperText sx={{ mt: "0 !important" }}>No record found</FormHelperText>
            </Stack>
          )}
        </Select>
      </FormControl>
      {error !== "" && (
        <FormHelperText error={error} sx={{ mt: "0 !important" }}>
          {error}
        </FormHelperText>
      )}
      {helperText && error === "" && <FormHelperText sx={{ mt: "0 !important" }}>{helperText}</FormHelperText>}
    </Box>
  );
}
