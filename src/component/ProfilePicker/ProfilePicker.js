/* eslint-disable no-unused-vars */
"use client";
import React, { forwardRef, useEffect, useState } from "react";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, Paper, Typography } from "@mui/material";

import ImagePreview from "../BannerPicker/ImagePreview";
import { CameraAltIcon } from "@/assets";
import useImagePicker from "@/hooks/useImagePicker";

const ProfilePicker = forwardRef(({ height = "300px", onImageSelect = () => {}, error, formError, value, previewImage, disable }, ref) => {
  const { getRootProps, getInputProps, isDragActive, errors, selectedImages, setSelectedImages } = useImagePicker(false);

  const [selectImage, setSelectImage] = useState({});
  useEffect(() => {
    if (selectedImages?.length) {
      onImageSelect(selectedImages);
      setSelectImage(selectedImages);
    }
  }, [selectedImages]);

  useEffect(() => {
    if (!value) {
      setSelectedImages([]);
    }
  }, [value]);

  return (
    <>
      <Box
        ref={ref}
        sx={{
          width: "216.17px",
          height: "213.18px",
          // background: "#DEDEDE",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100vw",
          position: "relative",
          overflow: "hidden",
          border: error ? "1px dashed #d32f2f" : disable ? "1px solid rgb(163 163 163)" : "none",
          ...(!disable && {
            cursor: "pointer",
            "& :hover": {
              "& .overlay": {
                scale: "1 !important",
              },
            },
          }),
        }}
      >
        <Box
          sx={{
            width: "216.17px",
            height: "213.18px",
            background: "#DEDEDE",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "100vw",
            position: "relative",
            overflow: "hidden",
            border: "8px solid white",
            ...(!disable && {
              cursor: "pointer",
            }),
          }}
          {...(!disable && getRootProps())}
        >
          {selectedImages?.length || previewImage ? (
            <>
              <Box
                sx={{
                  background: "#fff",
                  opacity: 0.4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  zIndex: 99,
                  scale: 0,
                  transition: "0.1s",
                  borderRadius: "50%",
                }}
                className="overlay"
              >
                <CameraAltIcon sx={{ height: 40, width: 40 }} />
              </Box>
              <ImagePreview imgUrl={selectedImages[0]?.imageDataUrl || previewImage} height={"213.18px"} width={"216.17px"} />
            </>
          ) : (
            <></>
          )}

          {isDragActive && (
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "#DEDEDE",
                zIndex: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" textAlign="center">
                Drop the image <br /> here
              </Typography>
            </Box>
          )}
          {!selectedImages?.length && !errors?.length && !previewImage && (
            <>
              <Paper
                variant="outlined"
                elevation={5}
                sx={{
                  width: "114.36px",
                  height: "91.2px",
                  borderRadius: "14px",
                  display: "Flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CloudUploadOutlinedIcon fontSize="large" color="secondary" />
                <Typography fontSize="12px" fontWeight="500" textAlign="center">
                  Upload Profile Image
                </Typography>
              </Paper>
            </>
          )}

          {!disable && <input {...getInputProps()} id="pickerInput" />}
        </Box>
      </Box>

      {(error || errors) && (
        <Box>
          <Typography color="error" textAlign="center" fontSize="13px">
            {error || errors}
          </Typography>
        </Box>
      )}
    </>
  );
});
ProfilePicker.displayName = ProfilePicker;
export default ProfilePicker;
