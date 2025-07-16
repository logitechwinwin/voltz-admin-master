import { Cancel } from "@mui/icons-material";
import { Box, Drawer, IconButton, Toolbar } from "@mui/material";
import React from "react";

const ChatDrawer = ({ children, open, onRequestClose }) => {
  return (
    <Drawer
      open={open}
      onClose={onRequestClose}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 320 },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onRequestClose} color="error">
          <Cancel />
        </IconButton>
      </Toolbar>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Drawer>
  );
};

export default ChatDrawer;
