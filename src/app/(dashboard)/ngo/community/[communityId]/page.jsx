"use client";
import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grow,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

import {
  AddIcon,
  ArrowUpwardIcon,
  ChevronLeftIcon,
  DummyBanner,
  NavigationIcon,
} from "@/assets";
import {
  CardButton,
  CommentBox,
  CommunityModal,
  InputField,
  JoinButton,
  ModalWrapper,
} from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const Community = ({ params }) => {
  const [communityData, setCommunityData] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const { communityId: CommunityId } = params;
  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const isMyCommunity = user?.id === communityData?.createdBy?.id;
  const isJoined = communityData?.isJoined;
  const pinnedPosts = posts.filter((item) => item?.pinned);
  const notPinnedPosts = posts.filter((item) => !item?.pinned);

  const getCommunity = async () => {
    try {
      let { data } = await ApiManager({ path: `community/${CommunityId}` });
      setCommunityData(data?.response?.details);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const getPosts = async () => {
    try {
      let { data } = await ApiManager({
        path: `post?communityId=${CommunityId}&page=${page}&perPage=${perPage}`,
      });

      let allPosts = data?.response?.details;
      if (
        allPosts?.length === 0 ||
        data?.response?.currentPage > data?.response?.totalPages
      ) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setPosts((prev) => [...prev, ...allPosts]);
        setPage((prev) => prev + 1);
      }
      //  else {
      //   setPosts((prev) => [...prev, ...allPosts]);
      // }

      // No more posts available
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      id,
      createdAt,
      updatedAt,
      deletedAt,
      isLiked,
      author,
      likesCount,
      ...rest
    } = formData;
    setLoading(true);
    if (!editId) {
      setOpen(false);
      dispatch(handleLoader(true));
    }
    try {
      let { data } = await ApiManager({
        method: editId ? "patch" : "post",
        path: editId ? `post/${editId}` : "post",
        params: { ...rest, communityId: CommunityId },
      });
      if (editId) {
        posts?.forEach((post, i) => {
          if (post?.id === editId) {
            const updatedPosts = [...posts];
            updatedPosts[i] = { ...post, content: formData?.content };
            setPosts(updatedPosts);
          }
        });
      }
      setEditId(null);
      setFormData({});
      setOpen(false);

      if (!editId) {
        posts?.unshift({ ...data?.response?.details, likesCount: 0 });
        setPosts(posts);
      }
      dispatch(setToast({ type: "success", message: data?.message }));
      console.log("data?.message", data);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
      dispatch(handleLoader(false));
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoader(true);
    try {
      let { data } = await ApiManager({ method: "delete", path: `post/${id}` });
      console.log("data?.message", data);
      const updatePosts = posts?.filter((post) => post?.id !== id);
      setPosts(updatePosts);
      dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setDeleteLoader(false);
    }
  };

  useEffect(() => {
    if (CommunityId) {
      getCommunity();
      getPosts();
    }
  }, []);

  const isBrowser = () => window !== undefined;
  const scrollToTop = () => {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    // Show the button when the user scrolls down

    if (window.scrollY > 1500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const Loader = () => {
    return (
      <Stack alignItems="center" width={1}>
        <CircularProgress />
      </Stack>
    );
  };

  return (
    <Container maxWidth="lg">
      <Stack gap={6} py={3}>
        <Stack gap={2}>
          <Button
            startIcon={<ChevronLeftIcon />}
            sx={{ alignSelf: "flex-start" }}
            onClick={() => router.back()}
          >
            Back
          </Button>
          {loading ? (
            <Skeleton
              variant="rounded"
              width="100%"
              sx={{
                height: { xs: "150px", md: "280px" },
              }}
            />
          ) : (
            <Box sx={Styles.banner} width={1}>
              <Image
                src={communityData?.bannerImage || DummyBanner}
                unoptimized
                alt="Community Banner"
                height={100}
                width={100}
                style={{
                  borderRadius: "15px",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="space-between"
          width={1}
          alignItems="center"
        >
          <Stack gap={1} width="100%">
            {loading ? (
              <Skeleton variant="rounded" width={220} height={40} />
            ) : (
              <Stack
                justifyContent="space-between"
                alignItems="center"
                direction="row"
              >
                <Typography fontWeight="bold" variant="h4">
                  {communityData?.title}
                </Typography>
              </Stack>
            )}
            {!isMyCommunity && (
              <Box maxWidth="40px">
                {loading ? (
                  <Skeleton variant="rounded" width={120} height={40} />
                ) : (
                  <JoinButton
                    setCommunityData={setCommunityData}
                    communityData={communityData}
                  />
                )}
              </Box>
            )}
            {loading ? (
              <>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={20}
                  sx={{ marginTop: "10px" }}
                />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={20}
                  sx={{ marginTop: "10px" }}
                />
                <Skeleton
                  variant="rounded"
                  width="70%"
                  height={20}
                  sx={{ marginTop: "10px" }}
                />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={20}
                  sx={{ marginTop: "10px" }}
                />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={20}
                  sx={{ marginTop: "10px" }}
                />
                <Skeleton
                  variant="rounded"
                  width="70%"
                  height={20}
                  sx={{ marginTop: "10px" }}
                />
              </>
            ) : (
              <Typography
                variant="subtitle1"
                color="rgba(39, 39, 46, 0.6)"
                sx={{ lineHeight: "27px", mt: 4, whiteSpace: "pre-line" }}
              >
                {communityData?.description}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Divider width="100%" />
        {loading ? (
          <Skeleton variant="rounded" width={100} height={30} />
        ) : (
          <Typography variant="h5" fontWeight="SemiBold">
            Posts
          </Typography>
        )}
        <Stack gap={4}>
          <Stack gap={1}>
            <Stack
              gap={2}
              sx={{
                position: "relative",
              }}
            >
              <InfiniteScroll
                style={{ overflow: "hidden" }}
                hasMore={hasMore}
                loader={<Loader />}
                dataLength={posts?.length}
                next={getPosts}
              >
                {/* Post Skeleton */}
                <Stack>
                  {pinnedPosts?.length ? (
                    <>
                      <Typography
                        fontSize="14px"
                        color="text.hint"
                        fontWeight="medium"
                      >
                        Pinned
                      </Typography>
                      {pinnedPosts?.map((post, i) => (
                        <CommentBox
                          key={i}
                          post={post}
                          posts={posts}
                          loading={loading}
                          setFormData={setFormData}
                          setPosts={setPosts}
                          handleDelete={handleDelete}
                          setOpen={setOpen}
                          setEditId={setEditId}
                          isMyCommunity={isMyCommunity}
                          communityId={communityData?.id}
                          deleteLoader={deleteLoader}
                        />
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <CommentBox key={i} loading="true" />
                    ))
                  ) : posts?.length ? (
                    <>
                      <Typography
                        fontSize="14px"
                        mt="10px"
                        color="text.hint"
                        fontWeight="medium"
                      >
                        All Posts
                      </Typography>
                      {notPinnedPosts?.map((post, i) => (
                        <Box key={post?.id} my={3}>
                          <CommentBox
                            post={post}
                            posts={posts}
                            loading={loading}
                            setFormData={setFormData}
                            setPosts={setPosts}
                            handleDelete={handleDelete}
                            setOpen={setOpen}
                            setEditId={setEditId}
                            isMyCommunity={isMyCommunity}
                            communityId={communityData?.id}
                            deleteLoader={deleteLoader}
                          />
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Typography
                      variant="h6"
                      color="text.hint"
                      textAlign="center"
                    >
                      Nothing here yet! Be the first to create a post.
                    </Typography>
                  )}
                </Stack>
              </InfiniteScroll>

              <Button
                sx={{
                  alignSelf: "flex-end",
                  position: "sticky",
                  bottom: 110,
                  right: 20,
                  borderRadius: "50%",
                  height: "61px",
                }}
                variant="contained"
                onClick={scrollToTop}
                style={{ display: visible ? "block" : "none" }}
              >
                <ArrowUpwardIcon />
              </Button>

              <Button
                sx={{
                  alignSelf: "flex-end",
                  position: "sticky",
                  bottom: 30,
                  right: 20,
                  borderRadius: "50%",
                  height: "61px",
                }}
                variant="contained"
                onClick={() => {
                  setOpen(true);
                }}
                style={{
                  display: isJoined || isMyCommunity ? "block" : "none",
                }}
              >
                <AddIcon />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <ModalWrapper
        open={open}
        handleClose={() => {
          setOpen(false);
          setFormData({});
          setEditId(null);
        }}
      >
        <Stack sx={{ p: 2 }} gap={2} component="form" onSubmit={handleSubmit}>
          <Typography fontWeight="bold" variant="h5">
            {editId ? "Update Post" : "Add Post"}
          </Typography>
          <InputField
            required
            multiline
            minRows={3}
            label="Post Content"
            name="content"
            onChange={(e) =>
              setFormData({
                content: e.target.value,
              })
            }
            value={formData?.content}
            error={formErrors?.content}
          />
          <Button disabled={loading} variant="contained" mt={1} type="submit">
            {loading ? (
              <CircularProgress size={28} sx={{ color: "grey" }} />
            ) : editId ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </Stack>
      </ModalWrapper>
      <CommunityModal
        open={openModal}
        data={communityData}
        setOpen={setOpenModal}
        callback={getCommunity}
      />
    </Container>
  );
};

export default Community;
const Styles = {
  banner: {
    backgroundSize: "contained",
    height: "50vh",
    maxHeight: "450px",
    position: "relative",
    borderRadius: "15px",
    overFlow: "hidden",
  },
  button: {
    px: 8,
    borderRadius: 5,
    fontSize: "20px",
    fontWeight: "SemiBold",
    color: "black",
    backgroundColor: "#fff",
  },
  image: {
    height: "54px",
    width: "54px",
    borderRadius: "27px",
    objectFit: "cover",
    backgroundColor: "grey",
  },
  follow: {
    color: "secondary.main",
    fontWeight: "bold",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  selected: {
    fontSize: "16px",
    fontWeight: "SemiBold",
    backgroundColor: "primary.main",
    border: "none",
    color: "#fff",
  },
  notSelected: {
    backgroundColor: "#D3E2E6",
    color: "secondary.main",
    border: "none",
    fontSize: "16px",
    fontWeight: "SemiBold",
  },
};
