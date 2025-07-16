import { SendIcon } from "@/assets";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { Box, Button, CircularProgress, IconButton, InputBase, Paper, Popover } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ChatInput = ({ onSendMessage, loading = true, disabled, onTypingStart, onTypingStop, multiline, rows ,activationStatus}) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSendMsg = () => {
    if (currentMsg.trim() !== "") {
      onSendMessage(currentMsg);
      setCurrentMsg("");
    }
  };

  const handleKeyDown = () => {
    if (!isTyping) {
      setIsTyping(true);
      if (onTypingStart) onTypingStart(); // Call the typing start callback if provided
    }

    // Clear previous timeout if the user is still typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyUp = () => {
    // Set a timeout to detect typing stop
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (onTypingStop) onTypingStop(); // Call the typing stop callback if provided
    }, 500); // Adjust this delay as needed
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, height: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: "12px",
          display: "flex",
          alignItems: "flex-end",
          width: "100%",
          background: "rgba(245, 245, 245, 1)",
          borderRadius: "15px",
          height: "auto",
          maxHeight: "150px", // Limit the total height of the Paper
          overflow: "hidden", // Ensure the Paper doesn't expand beyond the limit

        }}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            // height: "100%",
            maxHeight: "100px", // Set the maximum height
            overflowY: "auto",  // Enable scrolling when the content exceeds the max height
            resize: "none", // Prevent manual resizing of the input
            "::-webkit-scrollbar": { width: "0.4em" },
            "::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,.1)", borderRadius: "10px" },
          }}
          value={currentMsg}
          disabled={activationStatus ? activationStatus !== 'active' :disabled}
          multiline={true} // Ensure multiline behavior
          // rows={1} // Start with one row, grow dynamically
          placeholder="Type a message"
          onChange={(e) => setCurrentMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={(e) => {
            handleKeyUp();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent new line on pressing Enter
              handleSendMsg();
            }
          }}
        />

        <IconButton size="small" aria-describedby={id} onClick={handleClick} disabled={disabled}>
          <SentimentSatisfiedAltIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Box sx={{ width: "350px", height: "100%" }}>
            <Picker
              data={data}
              onEmojiSelect={(emoji) => setCurrentMsg((previous) => previous + "" + emoji.native)}
              pickerStyle={{ width: "100%" }}
              theme="light"
            />
          </Box>
        </Popover>
      </Paper>
      <Button
        color="secondary"
        variant="contained"
        disabled={(activationStatus && activationStatus !== "active") || disabled || loading}
        sx={{ p: "16px", borderRadius: "15px", height: "100%", maxHeight: "60px" }}
        onClick={handleSendMsg}
      >
        {loading ? <CircularProgress size={20} /> : <SendIcon />}
      </Button>
    </Box>
  );
};

export default ChatInput;
