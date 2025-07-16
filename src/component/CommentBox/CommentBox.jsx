"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useDispatch, useSelector } from "react-redux";

import { BasicMenu, Comment, InputField } from "..";
import {
  CloseIcon,
  FavoriteBorderIcon,
  FavoriteIcon,
  MessageIcon,
  SendIcon,
} from "@/assets";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const CommentBox = ({
  loading,
  post,
  deleteLoader,
  setPinnedPost,
  pinnedPost,
  isMyCommunity,
  communityId,
  setFormData,
  handleDelete,
  setOpen,
  setEditId,
  setPosts,
  posts,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the post is expanded
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [page, setPage] = useState(1);
  const [postId, setPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // for showing skeleton of comments
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false); // for showing loading when comment is posting
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.appReducer);
  TimeAgo.addDefaultLocale(en);
  const isMyPost = user?.id === post?.author?.id;
  const isAlreadyPinned = post?.pinned;
  const timeAgo = new TimeAgo("en-US");
  const time = post?.createdAt
    ? timeAgo?.format(new Date(post?.createdAt))
    : "";

  const handleLike = async () => {
    posts?.forEach((like, i) => {
      if (like?.id === post?.id) {
        const updatedPosts = [...posts];
        updatedPosts[i] = {
          ...like,
          isLiked: !like?.isLiked,
          likesCount: post?.isLiked
            ? +like?.likesCount - 1
            : +like?.likesCount + 1,
        };
        setPosts(updatedPosts);
      }
    });

    try {
      await ApiManager({
        method: "post",
        path: !post?.isLiked
          ? `post/${post?.id}/like`
          : `post/${post?.id}/unlike`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllComments = async (viewMore, currentPage) => {
    setIsLoading(true);
    try {
      let { data } = await ApiManager({
        path: `comments?postId=${post?.id}&page=${viewMore ? currentPage : page}&perPage=5`,
      });
      console.log("data?.comments", data);
      const fetchedComments = data?.response?.details;
      setTotalPages(data?.response?.totalPages);
      if (viewMore) {
        setAllComments((prev) => [...prev, ...fetchedComments]);
      } else {
        setAllComments(data?.response?.details);
      }
      setPostId(post?.id);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinned = async () => {
    const newPosts = [...posts];
    const index = newPosts.indexOf(post);
    // if (index !== -1) {
    //   newPosts.splice(index, 1);
    //   // newPosts.unshift(post);
    // }
    // setPosts(newPosts);

    // let sortedPosts = updatedPost?.sort((a, b) => b.pinned - a.pinned);
    if (isAlreadyPinned) {
      setPosts((prev) =>
        prev?.map((item, i) =>
          i === index ? { ...item, pinned: false } : item
        )
      );
    } else {
      setPosts((prev) =>
        prev?.map((item, i) =>
          i === index ? { ...item, pinned: true } : { ...item, pinned: false }
        )
      );
    }
    try {
      let { data } = await ApiManager({
        method: "patch",
        path: `post/${post?.id}`,
        params: isAlreadyPinned ? { unpinned: true } : { pinned: true },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentPost = async () => {
    if (comment?.trim() !== "") {
      setIsCommentSubmitting(true);
      setComment("");
      try {
        let { data } = await ApiManager({
          method: "post",
          path: "comments",
          params: {
            content: comment,
            postId,
          },
        });
        console.log("data?.message", data);
        setAllComments((prev) => [data?.response?.details, ...prev]);
        dispatch(setToast({ type: "success", message: data?.message }));
      } catch (error) {
        dispatch(setToast({ type: "error", message: error?.message }));
      } finally {
        setIsCommentSubmitting(false);
      }
    } else {
      setComment("");
    }
  };

  // Handler to toggle the expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isCommenting && postId !== post?.id && post?.commentsCount > 0) {
      getAllComments();
    }
    if (!isCommenting && post?.commentsCount > 0) {
      const topComments = allComments?.slice(0, 5);
      setPage(1);
      setAllComments(topComments);
    }
  }, [isCommenting]);

  return (
    <Stack gap={4} width={1} sx={Styles.container}>
      <Stack direction="row" width={1} justifyContent="space-between">
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          {/* <VolunteerLink id={post?.author?.id}> */}
          <Stack direction="row" gap={1}>
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : (
              <Avatar src={post?.author?.profileImage} />
            )}
            {loading ? (
              <Stack gap={1}>
                <Skeleton variant="rounded" width={80} height={15} />
                <Skeleton variant="rounded" width={40} height={10} />
              </Stack>
            ) : (
              <Stack>
                <Typography variant="body1" fontWeight="SemiBold">
                  {post?.author?.name ||
                    `${post?.author?.firstName} ${post?.author?.lastName}`}
                </Typography>
                <Typography variant="subtitle2" color="text.hint">
                  {time}
                </Typography>
              </Stack>
            )}
          </Stack>
          {/* </VolunteerLink> */}

          {(isMyCommunity || isMyPost) &&
            (loading ? (
              <Skeleton width={10} height={40} />
            ) : (
              <BasicMenu
                verticalIcon={true}
                setOpenMenu={setOpenMenu}
                openMenu={openMenu}
              >
                {isMyCommunity && (
                  <MenuItem onClick={handlePinned}>
                    {isAlreadyPinned ? `Unpin` : `Pin`}
                  </MenuItem>
                )}
                {isMyPost && (
                  <MenuItem
                    onClick={() => {
                      setFormData(post);
                      setOpen(true);
                      setEditId(post?.id);
                    }}
                  >
                    Edit
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleDelete(post?.id)}>
                  {deleteLoader ? (
                    <CircularProgress size={20} color="grey" />
                  ) : (
                    "Delete"
                  )}
                </MenuItem>
              </BasicMenu>
            ))}
        </Stack>
      </Stack>

      <Stack gap={1}>
        {loading ? (
          <>
            <Skeleton variant="rounded" width="80%" height={20} />
            <Skeleton variant="rounded" width="40%" height={20} />
          </>
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {isExpanded
              ? post?.content
              : `${post?.content.substring(0, 1000)}${post?.content.length > 1000 ? "..." : ""}`}
            {post?.content.length > 1000 && (
              <Button onClick={toggleExpand} sx={{ textTransform: "none" }}>
                {isExpanded ? "See Less" : "See More"}
              </Button>
            )}
          </Typography>
        )}
      </Stack>
      <Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <Stack direction="row" gap={0} alignItems="center">
            {loading ? (
              <Skeleton variant="rounded" width={25} height={25} />
            ) : (
              <IconButton onClick={handleLike}>
                {post?.isLiked ? (
                  <FavoriteIcon sx={{ color: "rgba(225, 6, 6, 1)" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            )}

            {loading ? (
              <Skeleton
                variant="rounded"
                width={20}
                height={20}
                sx={{ marginLeft: "4px" }}
              />
            ) : (
              <Typography color="text.hint" fontWeight="SemiBold">
                {post?.likesCount}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" gap={0} alignItems="center">
            {loading ? (
              <Skeleton variant="rounded" width={25} height={25} />
            ) : (
              <IconButton onClick={() => setIsCommenting(!isCommenting)}>
                <MessageIcon />
              </IconButton>
            )}

            {/* number of comments */}

            {loading ? (
              <Skeleton variant="rounded" width={20} height={20} sx={{ marginLeft: "4px" }} />
            ) : (
              <Typography color="text.hint" fontWeight="SemiBold">
                {post?.commentsCount}
              </Typography>
            )}
          </Stack>
        </Stack>
        {isCommenting && (
          <>
            <hr />
            <Stack mt={2} direction="row" gap={1}>
              <Stack width="100%">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" fontWeight="SemiBold">
                    Comments
                  </Typography>
                  <IconButton onClick={() => setIsCommenting(false)}>
                    <CloseIcon color="grey" />
                  </IconButton>
                </Stack>
                <Stack gap={2} my={2}>
                  <Stack direction="row" gap={1 / 2}>
                    <Avatar />

                    <InputField
                      sx={{ px: 3 }}
                      multiline
                      maxRows={4}
                      variant="standard"
                      disabled={isCommentSubmitting}
                      size="small"
                      placeholder="Enter comment here"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      InputProps={{
                        endAdornment: isCommentSubmitting ? (
                          <CircularProgress size={25} sx={{ color: "grey" }} />
                        ) : (
                          <InputAdornment position="end">
                            <IconButton>
                              <SendIcon onClick={handleCommentPost} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  {/* uncomment this stack for scroll in comment container */}

                  {/* <Stack gap={2} sx={{ maxHeight: "500px", overflow: "auto" }}> */}

                  {allComments?.map((item, i) => {
                    return (
                      <Comment
                        key={i}
                        item={item}
                        allComments={allComments}
                        setAllComments={setAllComments}
                        comment={comment}
                        setComment={setComment}
                      />
                    );
                  })}

                  {isLoading &&
                    Array(5)
                      .fill()
                      .map((_, i) => <Comment key={i} loading={isLoading} />)}
                  {/* </Stack> */}
                </Stack>
                {totalPages !== page && totalPages > 1 && (
                  <Button
                    sx={{ alignSelf: "center" }}
                    onClick={() => {
                      if (totalPages >= page) {
                        const nextPage = page + 1; // Calculate the next page
                        setPage(nextPage); // Update the page state
                        getAllComments(true, nextPage); // Pass the new page to the API call
                      }
                    }}
                  >
                    View more comments
                  </Button>
                )}
                {totalPages === page && totalPages > 1 && (
                  <Button
                    sx={{ alignSelf: "center" }}
                    onClick={() => setIsCommenting(false)}
                  >
                    Hide all comments
                  </Button>
                )}
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default CommentBox;

const Styles = {
  container: {
    backgroundColor: "#fff",
    p: 2,
  },
  profile: {
    height: "54px",
    width: "54px",
    borderRadius: "27px",
    objectFit: "cover",
    backgroundColor: "grey",
  },
  commentImage: {
    height: "390px",
    width: "390px",
    alignSelf: "center",
  },
  icon: {
    backgroundColor: "text.icon",
    borderRadius: "18px",
  },
  avatarGroup: {
    "& .MuiAvatar-root": {
      border: "4px solid white",
    },
  },
  avatar: {
    "& .MuiAvatar-img": {
      opacity: 0.4,
    },
  },
  reaction: {
    position: "absolute",
    top: "14px",
    left: "7px",
    height: "20px",
    width: "20px",
  },
  reactionContainer: {
    backgroundColor: "text.icon",
    position: "absolute",
    top: "-75px",
    right: { xs: "-88px", sm: "-180px" },
    gap: 1,
    padding: 1,
    borderRadius: "16px",
  },
  avatarBox: {
    ml: "-9px",
    position: "relative",
  },
};
