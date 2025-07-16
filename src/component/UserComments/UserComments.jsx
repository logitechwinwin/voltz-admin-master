"use client";
import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import { ApiManager } from "@/helpers";

const UserComments = ({ eventId, loading }) => {
  const [comments, setComments] = useState([]); // Stores all fetched comments
  const [displayedComments, setDisplayedComments] = useState([]); // Stores currently visible comments
  const [newComment, setNewComment] = useState(""); // Input field value
  const [page, setPage] = useState(1); // Page number for pagination
  const [hasMore, setHasMore] = useState(true); // Flag to control "View More" button
  const { user } = useSelector((state) => state.appReducer); // Get user info

  const COMMENTS_PER_PAGE = 10; // Comments per page

  // Fetch comments from API
  const fetchComments = async (currentPage = 1) => {
    try {
      const { data } = await ApiManager({
        path: `event-comments?eventId=${eventId}&page=${currentPage}&perPage=${COMMENTS_PER_PAGE}`,
      });
      const newComments = data?.response.details || [];

      // Check if more comments are available
      setHasMore(newComments.length === COMMENTS_PER_PAGE);

      // Update state with new comments, without duplicating
      setComments((prev) => [...prev, ...newComments]);

      // If it's the first load, set the displayed comments
      if (currentPage === 1) {
        setDisplayedComments(newComments);
      } else {
        setDisplayedComments((prev) => [...prev, ...newComments]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { data } = await ApiManager({
        method: "post",
        path: `event-comments`,
        params: { content: newComment, eventId },
      });

      const addedComment = data?.response.details;
      setComments((prev) => [addedComment, ...prev]); // Add new comment to the beginning
      setDisplayedComments((prev) => [addedComment, ...prev]);
      setNewComment(""); // Clear input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle "View More" button click
  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage); // Fetch more comments
  };

  // Handle "View Less" button click
  const handleViewLess = () => {
    setDisplayedComments(comments.slice(0, COMMENTS_PER_PAGE)); // Reset to first batch
    setPage(1);
    setHasMore(true); // Enable "View More" button again
  };

  // Initial fetch of comments
  useEffect(() => {
    fetchComments();
  }, [eventId]);

  return (
    <Stack
      gap={2}
      width={1}
      sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}
    >
      {loading ? (
        <Skeleton variant="rounded" width={80} height={30}></Skeleton>
      ) : (
        <Typography variant="body1" fontWeight="SemiBold" color="text.hint">
          Comments ({comments?.length ?? 0})
        </Typography>
      )}

      {/* Comment Input Section */}
      {loading ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rounded" height={40} width="100%" />
          <Skeleton variant="rounded" width={40} height={40} />
        </Stack>
      ) : (
        user?.role !== "admin" && user?.role !== 'campaign_manager' && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user?.profileImage || "/default-avatar.png"} />
            <TextField
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              fullWidth
              variant="standard"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              sx={{ minWidth: "40px" }}
            >
              <SendIcon />
            </Button>
          </Stack>
        )
      )}

      {/* Skeleton Loader or Comments */}
      {loading ? (
        <Stack gap={2}>
          {[...Array(COMMENTS_PER_PAGE)].map((_, index) => (
            <Stack key={index} direction="row" gap={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Stack width="100%">
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="80%" height={16} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack gap={2}>
          {displayedComments.map((comment) => (
            <Stack key={comment.id} direction="row" gap={2} alignItems="center">
              <Avatar
                src={comment?.commenter?.profileImage || "/default-avatar.png"}
              />
              <Stack>
                <Typography variant="body1" fontWeight="bold">
                  {comment?.commenter?.firstName} {comment?.commenter?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {comment.content}
                </Typography>
              </Stack>
            </Stack>
          ))}

          {/* Pagination Controls */}
          {hasMore && (
            <Button
              onClick={handleViewMore}
              variant="outlined"
              size="small"
              sx={{
                alignSelf: "center",
                width: "fit-content",
                px: 2,
                borderRadius: 20,
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              View More Comments
            </Button>
          )}
          {!hasMore && comments.length > COMMENTS_PER_PAGE && (
            <Button
              onClick={handleViewLess}
              variant="outlined"
              size="small"
              sx={{
                alignSelf: "center",
                width: "fit-content",
                px: 2,
                borderRadius: 20,
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              View Less Comments
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default UserComments;
