import React from "react";

import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel } from "@mui/material";

const CheckBox = ({ checked, handleChange = () => {}, value, name, label, labelTop, error }) => {
  return (
    <FormControl>
      {labelTop && <FormLabel>labelTop</FormLabel>}
      <FormControlLabel control={<Checkbox checked={checked} onChange={handleChange} name={name} value={value} />} label={label} />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CheckBox;
