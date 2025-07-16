import React from "react";

import { Stack, Typography } from "@mui/material";
import Image from "next/image";

import { Logo } from "@/assets";

const VoltzsCounterDisplayChip = ({ value }) => {
  return (
    <Stack
      sx={{
        py: "7px",
        justifyContent: "flex-start", // Align content to the left
        alignItems: "center", // Ensure items are vertically centered
        background: "#FAFAFA",
        borderRadius: "14.39px",
        width: "fit-content",
      }}
      direction="row"
      spacing={0.5}
    >
      <Typography fontWeight="bold" color="secondary">
        {value}
      </Typography>
      <Image
        src={Logo}
        alt="logo"
        style={{
          width: "15px",
        }}
      />
    </Stack>
  );
};

export default VoltzsCounterDisplayChip;
