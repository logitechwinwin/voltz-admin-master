import React from "react";

import { Paper, Typography } from "@mui/material";

const DashboardTableCardLayout = ({ children, title }) => {
  return (
    <Paper
      sx={{
        p: "24px",
        boxShadow: "0px 3.11px 3.11px 0px rgba(0, 0, 0, 0.2)",
        borderRadius: "12px",
        gap: "24px",
        height: 1,
        overflow: "hidden",
      }}
    >
      {title && (
        <Typography variant="h6">
          <strong>{title}</strong>
        </Typography>
      )}

      {children}
    </Paper>
  );
};

export default DashboardTableCardLayout;
