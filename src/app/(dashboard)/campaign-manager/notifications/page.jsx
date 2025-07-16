"use client";
import { useEffect, useState } from "react";

import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { ChevronLeftIcon } from "@/assets";
import { ScrollToTop } from "@/component";
import { SCREEN_TYPE } from "@/global";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";

const Notifications = () => {
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marksASReadLoading, setMarksASReadLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const showMessage = (type, msg) => dispatch(setToast({ type: type, message: msg }));

  const getAllNotifications = async (isLoadMore = false) => {
    if (page > totalPages) return; // Prevent fetching if all pages are loaded
    setLoading(true);
    if (page === 1) {
      //
    } else {
      setLoadMoreLoading(false);
    }

    try {
      const { data } = await ApiManager({ path: `notification?page=${page}` });
      if (page > 1) {
        setNotification((prev) => [...prev, ...(data?.response?.details?.items || [])]); // Append new notifications
      } else {
        setNotification(data?.response?.details?.items); // Append new notifications
      }
      setTotalPages(data?.response?.details?.meta?.totalPages);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  const handleNotificationClick = async () => {
    setMarksASReadLoading(true);
    try {
      await ApiManager({
        path: `notification/marks-all-as-read`,
        method: "post",
      });
      setNotification([]);
      setPage(1); // Reload all notifications
      getAllNotifications();
    } catch (error) {
      showMessage("error", "Something went wrong, please try again later");
    } finally {
      setMarksASReadLoading(false);
    }
  };

  const loadMoreNotifications = () => {
    setPage((prev) => prev + 1);
    setLoadMoreLoading(true);
  };

  useEffect(() => {
    getAllNotifications();
  }, [page, refresh]);

  return (
    <Container maxWidth="lg">
      <Stack gap={4} py={3}>
        <Stack gap={1}>
          <Button sx={{ alignSelf: "flex-start" }} startIcon={<ChevronLeftIcon />} onClick={() => router.back()}>
            Back
          </Button>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" fontWeight="bold">
              Notifications
            </Typography>
            <Stack direction={"row"}>
              <Button onClick={handleNotificationClick}>{marksASReadLoading ? <CircularProgress size={25} /> : "Mark all as read"}</Button>
              <Button
                color="error"
                onClick={() => {
                  setRefresh(!refresh);
                  setPage(1);
                  console.log("clreiekc asfdasb nfkj");
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Stack gap={3} minHeight="400px">
          <List disablePadding>
            {!!notification?.length &&
              notification?.map((notification, i) => (
                <Notification
                  key={i}
                  notificationData={notification}
                  loading={false}
                  setNotification={setNotification}
                  getAllNotifications={getAllNotifications}
                />
              ))}
            {(loading || loadMoreLoading) &&
              Array(10)
                .fill()
                .map((_, i) => <Notification key={i} loading={true} />)}
          </List>
          {!loading && !notification?.length && (
            <Typography textAlign="center" alignSelf="center" my="auto" variant="h6" fontWeight="Medium">
              No notifications to show
            </Typography>
          )}
          {!loading && page < totalPages && (
            <Box mx="auto" mt={2}>
              <Button onClick={() => loadMoreNotifications(true)} disabled={loadMoreLoading}>
                {loadMoreLoading ? <CircularProgress size={25} /> : "Load More"}
              </Button>
            </Box>
          )}
        </Stack>
      </Stack>
      <ScrollToTop />
    </Container>
  );
};

export default Notifications;

const Notification = ({ loading = true, notificationData = {}, read = false, setNotification, getAllNotifications }) => {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { notificationType, chatId, communityId, ...rest } = JSON.parse(notificationData.data || "{}");

  const handleNavigation = () => {
    if (notificationType === SCREEN_TYPE.NEW_DEAL_REQUEST) {
      return router.push(`company/deals-requests`);
    }
  };

  const handleNotificationClick = async () => {
    handleNavigation();
    if (notificationData.status === "sent") {
      try {
        await ApiManager({
          path: `notification/${notificationData?.id}`,
          method: "put",
        });
      } catch (error) {
        console.log("Error updating notification status:", error);
      }
    }
  };

  const deleteNotification = async () => {
    setDeleteLoading(true);
    try {
      await ApiManager({
        method: "delete",
        path: `notification/${notificationData?.id}`,
      });
      getAllNotifications();
    } catch (error) {
      console.log("Error deleting notification:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <ListItem disableGutters>
        <ListItemButton divider>
          <ListItemText primary={<Skeleton variant="text" width={200} />} secondary={<Skeleton variant="text" width={100} />} />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={deleteNotification} disabled={deleteLoading} color="error">
          {deleteLoading ? <CircularProgress size={20} /> : <Delete />}
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton onClick={handleNotificationClick} role={undefined} divider selected={notificationData.status === "sent"}>
        <ListItemText
          primary={notificationData?.title || <Skeleton variant="text" width={200} />}
          secondary={notificationData?.createdAt ? moment(notificationData?.createdAt).fromNow() : <Skeleton variant="text" width={100} />}
        />
      </ListItemButton>
    </ListItem>
  );
};
