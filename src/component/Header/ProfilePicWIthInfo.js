import React from "react";
import { PlaceOutlined } from "@mui/icons-material";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Utils from "@/Utils";

const ProfilePicWIthInfo = () => {
  const { user } = useSelector((state) => state.appReducer);
  const isAdmin = user?.role === "admin";
  const isCampaignManager = user?.role === "campaign_manager";
  const hasLocation = user?.city || user?.country;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      // sx={{ display: { xs: "none", sm: "flex" } }}
    >
      <Paper sx={{ borderRadius: "100vw" }} elevation={5}>
        <Avatar src={user?.profileImage}></Avatar>
      </Paper>
      <Box pl={0.5}>
        <Typography
          variant="body1"
          noWrap
          component="div"
          fontWeight={"bold"}
          color="primary.dark"
        >
          {isAdmin || isCampaignManager
            ? Utils.limitStringWithEllipsis(
                `${user?.firstName} ${user?.lastName}`,
                20
              )
            : Utils.limitStringWithEllipsis(user?.name, 20)}
        </Typography>
        <Stack direction={"row"} alignItems={"center"}>
          {/* Show the location icon and text only if location exists */}
          {hasLocation && !isAdmin && (
            <>
              <PlaceOutlined
                variant="body2"
                sx={{ color: "primary.neutralGrey", mr: 0.5 }}
              />
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  // color: "primary.neutralGrey",
                }}
              >
                {`${user?.city || ""}${user?.city && user?.country ? ", " : ""}${user?.country || ""}`}
              </Typography>
            </>
          )}
          {/* If admin, just show "Admin" text */}
          {isAdmin && (
            <Typography
              variant="body2"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                // color: "primary.neutralGrey",
              }}
            >
              Admin
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default ProfilePicWIthInfo;
