/* eslint-disable no-unused-vars */
import React from "react";

import { Button } from "@mui/material";

const StatusButton = ({ title, onClick, sx }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        ...{
          background: "#FCAF03",
          color: "#3C3F43",
          boxShadow: "none",
          fontWeight: "regular",
        },
      }}
      variant="contained"

    >
      {title}
    </Button>
  );
};

export default StatusButton;
