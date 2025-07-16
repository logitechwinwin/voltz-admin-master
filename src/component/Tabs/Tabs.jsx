import * as React from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

export default function CenteredTabs({ value, handleChange }) {
  // const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    // setValue(newValue);
    handleChange(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "rgba(6, 176, 186, 0.3)",
        p: 0.5,
        borderRadius: "10px",
      }}
    >
      <Tabs
        value={value}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs example"
        TabIndicatorProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
        sx={{
          "& .Mui-selected": {
            backgroundColor: "#fff",
            borderRadius: "10px",
            borderBottom: "none",
            fontWeight: "Medium",
            color: "secondary.main",
          },
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-between",
          },
          "& .MuiButtonBase-root": {
            p: 0.5,
            py: 1.5,
            minHeight: "35px",
            fontWeight: "Medium",
            flexGrow: 1,
            boxShadow: "0px 5px 20px 0px rgba(0, 0, 0, 0.05)",
          },
          minHeight: "35px",
        }}
        onChange={handleTabChange}
      >
        <Tab label="Today" />
        <Tab label="Yesterday" />
        <Tab label="Week" />
        <Tab label="Month" />
      </Tabs>
    </Box>
  );
}
