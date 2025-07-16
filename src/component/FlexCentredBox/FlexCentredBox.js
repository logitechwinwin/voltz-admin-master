import React from "react";

import { Box } from "@mui/material";

const FlexCentredBox = ({ sx, children, column, spaceBetween, center = true }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...(center && { justifyContent: "center" }),
        ...(spaceBetween && { justifyContent: "space-between" }),
        width: "100%",
        flexDirection: column && "column",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default FlexCentredBox;
