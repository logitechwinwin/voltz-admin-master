"use client";
import React, { useRef, useState } from "react";

import { Box, Fab, Input, InputLabel, Stack, Tooltip, Typography } from "@mui/material";
import Image from "next/image";

import { UploadFileIcon } from "@/assets";

const EditBanner = ({
  profileImage,
  showProfile = true,
  bannerError,
  profileError,
  bannerImage,
  handleBannerChange,
  handleProfileChange,
  profileImageRef,
  bannerImageRef,
}) => {
  const banner = useRef(null);
  const profile = useRef(null);

  return (
    <Stack gap={5} py={3}>
      <Stack gap={1}>
        {/* Banner Image Section */}
        <Box>
          <InputLabel
            htmlFor="label"
            sx={{
              m: 0,
              height: { xs: "30vh", md: "40vh" },
              border: bannerError && "1px solid red",
              borderRadius: "15px",
              maxHeight: "450px",
              position: "relative",
              cursor: "pointer",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          >
            {bannerError && showProfile && (
              <Typography sx={{ position: "absolute", top: 0, left: 4, zIndex: 99 }} variant="body2" textAlign="center" mt={1} color="error">
                {bannerError}
              </Typography>
            )}

            {/* Wrap the Image in a Box and assign the ref to the Box */}
            <Box
              ref={bannerImageRef}
              sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                "&:hover": {
                  "& .overlay": {
                    scale: 1,
                  },
                },
              }}
            >
              {bannerImage && (
                <Image
                  height={300}
                  width={300}
                  src={bannerImage}
                  unoptimized
                  alt="Banner"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    position: "absolute",
                  }}
                />
              )}
              <Box ref={banner} component="input" accept="image/*" style={{ display: "none" }} type="file" onChange={handleBannerChange} id="label" />
              {bannerImage && (
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    background: "rgba(255,255,255,0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 3,
                    scale: 0,
                    transition: "0.1s",
                  }}
                >
                  <Tooltip title="Update banner image">
                    <Fab color="primary" onClick={() => banner.current.click()}>
                      <UploadFileIcon />
                    </Fab>
                  </Tooltip>
                </Box>
              )}
              {!bannerImage && (
                <>
                  <Typography variant="h6" sx={Styles.editImage}>
                    Upload Cover Image
                  </Typography>

                  <Box sx={Styles.opacity} />
                </>
              )}
            </Box>
          </InputLabel>
          {!showProfile && bannerError && (
            <Typography variant="body2" mt={1} color="error">
              {bannerError}
            </Typography>
          )}
        </Box>
        {/* Profile Image Section */}
        <Box sx={{ width: "fit-content", marginLeft: "68px" }}>
          {showProfile && (
            <>
              <InputLabel
                htmlFor="labels"
                sx={{
                  ...Styles.banner,
                  boxShadow: profileError ? "0 0 0 1px rgba(255, 0, 0, 1)" : "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                {/* Wrap the Image in a Box and assign the ref to the Box */}
                <Box
                  ref={profileImageRef}
                  sx={{
                    height: "100%",
                    width: "100%",
                    "&:hover": {
                      "& .overlayProfile": {
                        scale: 1,
                      },
                    },
                  }}
                >
                  <Box
                    ref={profile}
                    component="input"
                    accept="image/*"
                    sx={{ display: "none" }}
                    type="file"
                    id="labels"
                    onChange={handleProfileChange}
                  />
                  {profileImage && <Image width={200} height={200} unoptimized src={profileImage} alt="Profile" style={Styles.image} />}

                  {!profileImage && <Box sx={Styles.bannerOpacity} />}
                  {profileImage && (
                    <Box
                      className="overlayProfile"
                      sx={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        borderRadius: "100px",
                        top: 0,
                        background: "rgba(255,255,255,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 99,
                        scale: 0,
                        transition: "0.1s",
                      }}
                    >
                      <Tooltip title="Update profile image">
                        <Fab color="primary" onClick={() => profile.current.click()}>
                          <UploadFileIcon />
                        </Fab>
                      </Tooltip>
                    </Box>
                  )}
                  {!profileImage && (
                    <Typography variant="h6" fontWeight="regular" sx={Styles.editProfile} color="#fff">
                      Upload <br /> Profile Image
                    </Typography>
                  )}
                </Box>
              </InputLabel>
              {profileError && (
                <Typography variant="body2" textAlign="center" mt={1} ml={-7} color="error">
                  {profileError}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default EditBanner;

const Styles = {
  bannerContainer: {
    backgroundSize: "cover",
    maxHeight: "450px",
    position: "relative",
    borderRadius: "15px",
    cursor: "pointer",
  },
  image: {
    borderRadius: "44%",
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  opacity: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "15px",
  },
  banner: {
    width: { xs: "200px", md: "222px" },
    height: { xs: "200px", md: "222px" },
    border: "7px solid #fff",
    // boxShadow: "0px 7.43px 14.85px 0px rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    marginTop: "-123px",

    zIndex: 5,
    cursor: "pointer",
  },
  editImage: {
    position: "absolute",
    zIndex: 5,
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  editProfile: {
    position: "absolute",
    zIndex: 6,
    top: "50%",
    left: "40%",
    transform: "translate(-33%,-50%)",
    textAlign: "center",
  },
  bannerOpacity: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgb(124 124 125)",
    // opacity: 0.5,
    position: "absolute",
    top: 0,
    borderRadius: "105px",
    zIndex: 5,
  },
};
