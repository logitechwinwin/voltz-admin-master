"use client";
import React, { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { BasicMenu } from "..";
import Utils from "@/Utils";

function NgoCard({ ngo, loading }) {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <Card
      sx={{ px: 1.5, py: 2, borderRadius: "10px", boxShadow: 2 }}
      component={Stack}
      direction="row"
      justifyContent="space-between"
    >
      <Stack gap={3} width="100%">
        <Stack direction="row" gap={1.5} alignItems="center">
          {loading ? (
            <Skeleton variant="circular" width={56} height={56} />
          ) : (
            <Avatar
              sx={{
                height: 56,
                width: 56,
                border: "2px solid white",
                boxShadow: "0px 4.54px 7.57px 0px rgba(0, 0, 0, 0.2)",
              }}
              src={ngo?.profileImage}
            />
          )}
          <Stack gap={0.5} sx={{ minWidth: 0 }}>
            {loading ? (
              <Skeleton width={120} height={20} />
            ) : (
              <Typography
                noWrap
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: "132px",
                }}
              >
                {ngo?.name}
              </Typography>
            )}
            {loading ? (
              <Skeleton width={100} height={15} />
            ) : (
              <Typography
                variant="body2"
                fontWeight="SemiBold"
                color="text.hint"
              >{`${ngo?.followercount} Followers`}</Typography>
            )}
          </Stack>
        </Stack>
        {/* <Stack direction="row" gap={2} width="100%">
          <Button variant="contained" fullWidth>
            Edit
          </Button>
          <Button variant="contained" fullWidth>
            History
          </Button>
        </Stack> */}
      </Stack>
      <Box sx={{ alignSelf: "flex-start" }}>
        {loading ? (
          <Skeleton variant="rounded" width={5} height={20} />
        ) : (
          <BasicMenu
            verticalIcon={true}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <Link href={`/admin/ngo-kyc/${ngo?.id}`} style={{ width: "100%" }}>
              <MenuItem>Edit</MenuItem>
            </Link>
            <Link href="/admin/ngos/1" style={{ width: "100%" }}>
              <MenuItem>History</MenuItem>
            </Link>
          </BasicMenu>
        )}
      </Box>
    </Card>
  );
}

export default NgoCard;
