"use client";

import React from "react";
import Image from "next/image";
import { Box, Card, Skeleton, Stack, Typography } from "@mui/material";
import { DummyBanner, DummyProfile, VoltzIcon } from "@/assets";
import Utils from "@/Utils";
import moment from "moment";

const TopCampaignCard = ({ deal, loading }) => {
  let startDate = moment(deal?.from);
  let endDate = moment(deal?.to);

  let dateDiff;
  let now = moment(); // Current date and time

  let expired = endDate.isBefore(now);
  let upcoming = startDate.isAfter(now);
  let ongoing = startDate.isSameOrBefore(now) && endDate.isAfter(now);

  if (expired) {
    dateDiff = "Expired";
  } else if (upcoming) {
    dateDiff = "Upcoming";
  } else if (ongoing) {
    dateDiff = "Ongoing";
  }

  return (
    <Card sx={Styles.card}>
      <Stack sx={Styles.container} gap={2}>
        {loading ? (
          <Stack
            direction="row"
            px={1}
            width="87%"
            justifyContent="space-between"
            sx={Styles.imageContainer}
          >
            <Skeleton variant="rectangular" width={40} height={20} />
            <Skeleton variant="rectangular" width={40} height={20} />
          </Stack>
        ) : (
          <Stack
            direction="row"
            px={1}
            width="87%"
            justifyContent="space-between"
            sx={Styles.imageContainer}
          >
            <Card sx={{ p: 1 }}>
              <Stack variant="body1" direction="row" fontWeight="bold" gap={1}>
                <Typography variant="body1" fontWeight="bold">
                  {deal?.voltzRequired}
                </Typography>
                <Image src={VoltzIcon} alt="VoltzIcon" width={15} />
              </Stack>
            </Card>
            <Card sx={{ p: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                {deal?.discountType === "fixed"
                  ? `$${deal?.discountAmount}`
                  : `${deal?.discountAmount}%`}{" "}
                Off
              </Typography>
            </Card>
          </Stack>
        )}

        {/* Image section */}
        {loading ? (
          <Skeleton
            variant="rectangular"
            sx={{
              height: "180px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "14px",
            }}
          />
        ) : (
          <Image
            src={deal?.bannerImage || DummyBanner}
            alt=""
            style={Styles.image}
            width={1}
            height={1}
            unoptimized
          />
        )}

        {/* Bottom section with Deal Name and Voltz Received */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {loading ? (
            <Skeleton variant="text" width={120} />
          ) : (
            <Typography variant="h6" fontWeight="bold">
              {Utils.limitStringWithEllipsis(deal?.dealName, 16)}
            </Typography>
          )}

          {loading ? (
            <Stack direction="row" alignItems="center" gap={1}>
              <Skeleton variant="text" width={40} />
            </Stack>
          ) : (
            <Stack
              direction="row"
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Typography variant="h4" fontWeight="bold" color="primary">
                {"+" + deal?.voltzReceived}
              </Typography>
              <Image src={VoltzIcon} alt="VoltzIcon" width={26} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default TopCampaignCard;

const Styles = {
  card: {
    boxShadow: "0px 2px 7.5px 0px #00000040",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    margin: "30px auto",
  },
  container: {
    p: 2,
    backgroundColor: "#fff",
    position: "relative",
  },
  imageContainer: {
    position: "absolute",
    top: "25px",
  },
  image: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    borderRadius: "14px",
  },
};
