/* eslint-disable no-unused-vars */
import * as React from "react";
import { useState, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Avatar, Menu, MenuItem, Stack, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { ArchiveModal, DeleteDialogBox } from "..";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";
import Utils from "@/Utils";

export default function EventCard({
  isCampaignManager,
  setArchiveModal,
  community = false,
  event,
  setEventId,
  setImagePreview,
  setOpen,
  setFormData,
  loading,
  callback,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [archived, setArchived] = useState(false);
  const dispatch = useDispatch();
  const openMenu = Boolean(anchorEl);
  let router = useRouter();

  const disableLinkBehavior = (e) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.preventDefault();
  };

  const handleClick = (event) => {
    disableLinkBehavior(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    disableLinkBehavior(event);
    setAnchorEl(null);
  };

  let { bannerImage, city, title, description, user, isArchived, id } =
    event || {};

  useEffect(() => {
    setArchived(event?.closed !== null);
  }, [event]);

  const handleArchive = async () => {
    try {
      let { data } = await ApiManager({
        method: "post",
        path: `events/toggle-event-archive/${id}`,
      });
      callback();
      console.log("data?.message", data);
      setArchived(!archived);
      dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const renderMenu = () => (
    <Menu
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      anchorEl={anchorEl}
      open={openMenu}
      onClick={handleClose}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
        },
        elevation: 6,
      }}
    >
      {isCampaignManager ? (
        <MenuItem component={Link} href={`/campaign-manager/campaign/${id}`}>
          View
        </MenuItem>
      ) : (
        <MenuItem
          component={Link}
          href={community ? `/ngo/community/${id}` : `/ngo/events/${id}`}
        >
          View
        </MenuItem>
      )}
      {!isCampaignManager &&
        (!community ? (
          <>
            <MenuItem>
              <Link href={`/ngo/update-event/${id}`}>Edit</Link>
            </MenuItem>
            <MenuItem onClick={() => setOpenModal(true)}>
              {archived ? `Unarchive` : `Archive`}
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={() => {
              setOpen(true);
              setEventId(event);
              setFormData(event);
              setImagePreview(event?.bannerImage);
            }}
          >
            Edit
          </MenuItem>
        ))}
    </Menu>
  );

  if (loading) {
    return (
      <Card
        sx={{
          display: "flex",
          overflow: "hidden",
          borderRadius: "16px",
          minHeight: "160px",
        }}
      >
        <Skeleton variant="rectangular" width={400} height={160} />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Stack
              direction={"row"}
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={100} />
              </Stack>
              <Skeleton variant="circular" width={40} height={40} />
            </Stack>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="90%" />
          </CardContent>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        display: "flex",
        overflow: "hidden",
        borderRadius: "16px",
        minHeight: "160px",
      }}
    >
      <CardMedia sx={{ width: { sm: 400, xs: 300 } }}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={bannerImage} layout="fill" objectFit="cover" alt="" />
        </div>
      </CardMedia>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Stack
            direction={"row"}
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              {!community ? (
                <>
                  <Avatar>
                    {user?.profileImage && (
                      <Image
                        src={user?.profileImage}
                        layout="fill"
                        objectFit="cover"
                        alt=""
                      />
                    )}
                  </Avatar>
                  <Typography fontWeight="bold" color="text.disabled">
                    {Utils.limitStringWithEllipsis(user?.name, "10")}
                  </Typography>
                </>
              ) : (
                <Stack>
                  <Typography
                    fontWeight={"ExtraBold"}
                    variant="h6"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography color="text.hintV2" fontWeight="bold">
                    {`${event?.totalMembers} members`}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <IconButton onClick={handleClick}>
              <MoreHorizIcon fontSize="large" />
            </IconButton>
            {renderMenu()}
          </Stack>
          {!community && (
            <Typography fontWeight={"ExtraBold"} variant="h6">
              {Utils.limitStringWithEllipsis(title, "20")}
            </Typography>
          )}
          {!community ? (
            <Typography whiteSpace="wrap">
              {Utils.limitStringWithEllipsis(description, "30")}
            </Typography>
          ) : (
            <Typography
              mt={2}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </Typography>
          )}
        </CardContent>
      </Box>
      <ArchiveModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        message={`Are you sure you want to ${archived ? `Unarchive` : `Archive`} ${title}?`}
        title={`${archived ? `Unarchive` : `Archive`} ${title} ?`}
        onClick={handleArchive}
      />
    </Card>
  );
}
