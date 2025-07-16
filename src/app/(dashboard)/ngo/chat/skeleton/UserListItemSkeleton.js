import React from "react";
import { ListItem, ListItemAvatar, ListItemButton, Stack, Avatar, Badge, Typography, Skeleton } from "@mui/material";

const UserListItemSkeleton = () => {
  return Array(10)
    .fill("_")
    .map(() => (
      <ListItem disablePadding divider className="list-item">
        <ListItemButton sx={{ ...linkStyles }}>
          <Stack gap={2} direction="row" width={1} alignItems="center">
            <ListItemAvatar>
              <Skeleton variant="circular" width={56} height={56} />
            </ListItemAvatar>
            <Stack width={1}>
              <Stack direction="row" justifyContent="space-between" width={1}>
                <Skeleton variant="text" width="30%" height={30} />
                <Skeleton variant="text" width="20%" height={20} />
              </Stack>
              <Stack direction="row" justifyContent="space-between" width={1} alignItems="center">
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="circular" width={24} height={24} />
              </Stack>
            </Stack>
          </Stack>
        </ListItemButton>
      </ListItem>
    ));
};

export default UserListItemSkeleton;

const linkStyles = {
  "&.Mui-selected": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    "& *": {
      transition: "0.2s all ease-in-out",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&::before": {
      height: "100%",
    },
  },
  "&::before": {
    content: `''`,
    position: "absolute",
    top: "50%",
    right: "0",
    transform: "translateY(-50%) ",
    height: "0",
    width: "4px",
    backgroundColor: "primary.main",
    transition: "0.2s all ease-in-out",
  },
  "&:hover::before": {
    height: "100%",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
};
