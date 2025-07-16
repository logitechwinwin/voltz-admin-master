import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { forwardRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { motion } from "framer-motion";
import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";
import moment from "moment"; // Import moment.js for date formatting

const ChatBox = forwardRef(
  ({ recipient, activeChat, handleSendMsg, sendMsgLoading, hasMoreChat, loading, messages, chatLoading, handleScroll, handleOpenDrawer }, ref) => {
    // Animation variants for chat bubbles
    const bubbleVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    };

    // Helper function to determine the type of date divider (Today, Yesterday, or specific date)
    const getMessageDivider = (currentMessage, previousMessage) => {
      const currentMessageDate = moment(currentMessage.createdAt).startOf("day");
      const previousMessageDate = previousMessage ? moment(previousMessage.createdAt).startOf("day") : null;

      if (!previousMessageDate || !currentMessageDate.isSame(previousMessageDate)) {
        if (currentMessageDate.isSame(moment(), "day")) {
          return "Today";
        } else if (currentMessageDate.isSame(moment().subtract(1, "day"), "day")) {
          return "Yesterday";
        } else {
          return currentMessageDate.format("MMMM D, YYYY");
        }
      }
      return null;
    };

    return (
      <Stack component={Paper} variant="outlined" sx={{ height: "100%", borderRadius: "20px", overflow: "hidden" }} key={activeChat?.id || ""}>
        {/* Chat Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <ChatHeader recipient={recipient} handleOpenDrawer={handleOpenDrawer} />
        </motion.div>

        {/* Messages Container with Infinite Scroll */}
        <MessagesContainer ref={ref} activeChat={activeChat} loading={loading} chatLoading={chatLoading} messages={messages}>
          <InfiniteScroll
            dataLength={messages?.length}
            next={handleScroll}
            inverse={true}
            hasMore={hasMoreChat}
            scrollableTarget="scrollableDiv"
            style={{ display: "flex", flexDirection: "column-reverse", gap: "24px" }}
          >
            {/* Animate message bubbles */}
            {messages?.map((item, index) => {
              const previousMessage = messages[index + 1]; // Compare with the previous message in reverse order
              const divider = getMessageDivider(item, previousMessage);

              return (
                <div key={item.id}>
                  {/* Date Divider */}
                  {divider && (
                    <Divider>
                      <Chip label={divider} size="small" />
                    </Divider>
                  )}

                  {/* Message Bubble Animation */}
                  <motion.div variants={bubbleVariants} initial="hidden" animate="visible">
                    <ChatBubble item={item} />
                  </motion.div>
                </div>
              );
            })}
          </InfiniteScroll>
        </MessagesContainer>

        {recipient && recipient?.activationStatus !== 'active' && <Divider variant="middle">
          <Chip className="font-semibold tracking-wide" label={`This ${recipient?.role?.toUpperCase()} is inactive`} size="medium" color="error" />
        </Divider>}
        {/* Chat Input Box */}
        <Box sx={{ p: 1 }}>
          <ChatInput onSendMessage={handleSendMsg} loading={sendMsgLoading} disabled={!activeChat} activationStatus={recipient?.activationStatus} />
        </Box>
      </Stack>
    );
  }
);

export default ChatBox;
