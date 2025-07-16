"use client";

import React from "react";

import {
  Box,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import Image from "next/image";

import { Logo, VoltzIcon } from "@/assets";

const SingleEventStats = ({
  loading,
  stats = [],
  details = [],
  facebookUrl,
  type,
  linkedinUrl,
  twitterUrl,
  youtubeUrl,
}) => {
  const isCampaign = type === "campaign";
  const renderLink = (label, url) => (
    <>
      <Typography fontWeight="SemiBold" variant="body2">
        {label}:
      </Typography>
      {loading ? (
        <Skeleton variant="text" width="80%" />
      ) : url ? (
        <Link
          href={url}
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </Link>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No {label} link available
        </Typography>
      )}
    </>
  );

  return (
    <>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom fontWeight="SemiBold">
          Stats:
        </Typography>
        <Grid container spacing={2}>
          {stats
            .filter((item) => item !== null)
            .map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                {loading ? (
                  <Skeleton variant="text" width="100%" height={"100%"} />
                ) : (
                  <Stack
                    component={Paper}
                    p={3}
                    elevation={4}
                    height={1}
                    justifyContent="space-between"
                  >
                    <Typography fontWeight="SemiBold" variant="h6">
                      {item?.label}:
                    </Typography>
                    <Stack direction="row" alignSelf="flex-end" spacing={1}>
                      <Typography variant="h4" alignSelf="flex-end">
                        {(item?.label === "Donation Received" ||
                          item?.label === "Donation Required") &&
                          "$"}
                        {item?.value}
                      </Typography>
                      {item?.label === "Voltz Spent" && (
                        <Image src={Logo} alt="Logo" width={24} height={24} />
                      )}
                    </Stack>
                  </Stack>
                )}
              </Grid>
            ))}
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom fontWeight="SemiBold">
          About this event:
        </Typography>
        <Grid container spacing={2}>
          {details.map((item, index) => {
            if (!isCampaign && item.label === "Volt Per Hour") return;
            return (
              <Grid item xs={12} sm={6} key={index}>
                <Stack>
                  {loading ? (
                    <>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton width="80%" />
                    </>
                  ) : (
                    <>
                      {/* <Stack gap={1}> */}
                      {/* {item?.icon} */}
                      <Typography fontWeight="SemiBold" variant="body2">
                        {item.label}:
                      </Typography>
                      {item.label === "Volt Per Hour" ? (
                        <Stack direction="row" gap={0.5}>
                          <Image src={VoltzIcon} alt="VoltzIcon" width={15} />
                          <Typography>{item.value || "0"}</Typography>
                        </Stack>
                      ) : (
                        <Typography>{item.value}</Typography>
                      )}
                      {/* </Stack> */}
                    </>
                  )}
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom fontWeight="SemiBold">
          Social Links:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack>{renderLink("Facebook", facebookUrl)}</Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack>{renderLink("Twitter", twitterUrl)}</Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack>{renderLink("LinkedIn", linkedinUrl)}</Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack>{renderLink("Youtube", youtubeUrl)}</Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SingleEventStats;

const SocialLinks = ({
  loading,
  facebookUrl,
  linkedinUrl,
  twitterUrl,
  youtubeUrl,
}) => {
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom fontWeight="SemiBold">
        Social Links:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Stack>{renderLink("Facebook", facebookUrl)}</Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack>{renderLink("Twitter", twitterUrl)}</Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack>{renderLink("LinkedIn", linkedinUrl)}</Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack>{renderLink("Youtube", youtubeUrl)}</Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
