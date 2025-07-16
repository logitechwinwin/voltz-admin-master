import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll"; // Double tick icon
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";

const ChatBubble = ({ item, loading }) => {
  const { user } = useSelector((state) => state.appReducer);
  const isMe = item?.sender?.id === user?.id;

  // State to manage whether the full content is shown
  const [showMore, setShowMore] = useState(false);

  // Define a character limit for the content
  const contentLimit = 150;
  const isLongContent = item?.content?.length > contentLimit;

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  // Define message status
  const isRead = item?.status === "read";
  const isDelivered = item?.status === "unread";
  const isSent = item?.status === "unread";

  const formatDate = (dateString) => {
    const date = moment(dateString);

    if (date.isSame(moment(), "day")) {
      return `Today, ${date.format("hh:mm a")}`;
    } else {
      return date.format("MMM DD, h:mm a");
    }
  };


  if (loading) {
    // Skeleton state while loading
    return (
      <Box
        sx={{
          bgcolor: "#d4d4d4",
          width: "max-content",
          px: 2,
          py: 0.8,
          maxWidth: "70%",
          wordBreak: "break-word",
          borderRadius: isMe ? "10px 10px 0px 10px" : "0px 10px 10px 10px",
          ...(isMe && {
            ml: "auto",
          }),
          my: 1,
        }}
      >
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width={80} height={15} sx={{ mt: 0.5 }} />
      </Box>
    );
  }

  const alignment = { alignSelf: isMe ? "flex-end" : "flex-start" };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#d4d4d4",
          width: "max-content",
          px: 2,
          py: 0.8,
          maxWidth: "60%",
          wordBreak: "break-word",
          borderRadius: isMe ? "15px 15px 0px 15px" : "0px 15px 15px 15px",
          ...(isMe && {
            ml: "auto",
            background: (theme) => theme.palette.primary.main,
            color: "white",
          }),
          my: 1,
        }}
      >
        {/* Display the content with "See More" toggle if content is too long */}
        {isLongContent ? (
          <>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {showMore ? item?.content : `${item?.content.slice(0, contentLimit)}...`}
            </Typography>
            <Button size="small" onClick={toggleShowMore} sx={{ mt: 1, color: isMe ? "white" : "primary.main" }}>
              {showMore ? "See Less" : "See More"}
            </Button>
          </>
        ) : (
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {item?.content}
          </Typography>
        )}
      </Box>
      <Stack direction={"row"} width={1} justifyContent={isMe ? "flex-end" : "flex-start"}>
        <Typography variant="body2" color="#9D9D9D" sx={{ textAlign: isMe ? "right" : "left" }}>
          {/* <TimeAgo createdAt={item?.createdAt} /> */}
          {formatDate(item?.createdAt)}
        </Typography>
        {isMe && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
            }}
          >
            {isRead ? (
              <DoneAllIcon sx={{ color: "blue", fontSize: 16, ml: 0.5 }} />
            ) : isDelivered ? (
              <DoneAllIcon sx={{ color: "gray", fontSize: 16, ml: 0.5 }} />
            ) : isSent ? (
              <DoneIcon sx={{ color: "gray", fontSize: 16, ml: 0.5 }} />
            ) : null}
          </Box>
        )}
      </Stack>
    </>
  );
};

export default ChatBubble;
