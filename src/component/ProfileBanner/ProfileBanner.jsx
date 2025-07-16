"use client";
import React from "react";

import { Box, Stack } from "@mui/material";
import Image from "next/image";

const ProfileBanner = ({ bannerImage, profileImage, coverContain = false }) => {
  return (
    <Stack gap={5} py={3}>
      <Stack gap={1}>
        <Box
          sx={{
            ...Styles.bannerContainer,
            mb: profileImage ? { xs: "50px", md: "90px" } : "0px",
            height: { xs: "30vh", sm: "50vh" },
            background: `url(${bannerImage}) no-repeat center center`,
            ...(coverContain && { backgroundSize: "contain !important", backgroundColor: "#00000014" }),
          }}
          width={1}
        >
          {profileImage && (
            <Box sx={Styles.banner}>
              <Image src={profileImage} width={1} unoptimized height={1} alt="" style={Styles.image} />
            </Box>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default ProfileBanner;

const Styles = {
  bannerContainer: {
    backgroundSize: "cover",
    maxHeight: "450px",
    position: "relative",
    borderRadius: "15px",
  },
  image: {
    borderRadius: "50%",
    height: "100%",
    width: "100%",
  },
  banner: {
    position: "absolute",
    bottom: { xs: -75, md: -96 },
    left: { xs: "50%", sm: 36 },
    transform: { xs: "translateX(-50%)", sm: "translateX(0)" },
    width: { xs: "200px", md: "222px" },
    height: { xs: "200px", md: "222px" },
    border: "7px solid #fff",
    boxShadow: "0px 7.43px 14.85px 0px rgba(0, 0, 0, 0.2)",
    borderRadius: "50%",
    zIndex: 2,
  },
};
