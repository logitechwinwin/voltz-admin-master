import React, { forwardRef } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import SmsIcon from "@mui/icons-material/Sms";
import ChatIcon from "@mui/icons-material/Chat";

const MessagesContainer = forwardRef(({ activeChat, loading, chatLoading, messages, children }, ref) => {
  return (
    <Box sx={{ position: "relative", height: 1, overflow: "auto" }}>
      {loading && activeChat && (
        <Stack
          my={2}
          justifyContent="center"
          alignItems="center"
          sx={{ position: "absolute", top: 50, left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <CircularProgress />
        </Stack>
      )}

      {/* ChatMessagesList Component */}
      <Stack
        ref={ref}
        id="scrollableDiv"
        sx={{
          px: 2,
          py: 2,
          flexDirection: "column-reverse",
          overflow: "auto",
          height: 1,
          scrollBehavior: "smooth",
          "::-webkit-scrollbar": { width: "0.4em" },
          "::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,.1)", borderRadius: "10px" },
        }}
      >
        {!activeChat && !loading ? (
          // Show UI when no chat is selecteda
          <Stack justifyContent="center" alignItems="center" height={1} gap={2} mt={4}>
            <SmsIcon color="action" sx={{ fontSize: 80 }} />
            <Typography variant="h6" color="text.secondary">
              No chat selected, choose a conversation to start!
            </Typography>
          </Stack>
        ) : messages?.length === 0 && !chatLoading && !loading ? (
          // Show UI when no messages are available in the selected chat
          <Stack justifyContent="center" alignItems="center" height={1} gap={2} mt={4}>
            <ChatIcon color="action" sx={{ fontSize: 80 }} />
            <Typography variant="h6" color="text.secondary">
              No messages yet, start the conversation!
            </Typography>
          </Stack>
        ) : (
          // Show message list if there are messages
          children
        )}
      </Stack>
    </Box>
  );
});

export default MessagesContainer;
