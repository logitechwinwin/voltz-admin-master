/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useRef, useState } from "react";

import { DeleteForever, UploadFile } from "@mui/icons-material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Button, Divider, Fab, Stack, Tooltip, Typography } from "@mui/material";

import ImagePreview from "../BannerPicker/ImagePreview";
import { AddIcon } from "@/assets";
import useImagePicker from "@/hooks/useImagePicker";

const FilePicker = ({ onImageSelect = () => {}, previewImage, error, formError, showDelete = true }) => {
  const [activeImage, setActiveImage] = useState(0);
  const { getRootProps, getInputProps, isDragActive, errors, selectedImages, setSelectedImages } = useImagePicker(true);
  // const [selectImage, setSelectImage] = useState({});
  const deleteImage = () => {
    // const updatedImages = [...selectedImages];
    // updatedImages.splice(index, 1);
    // setMedias(updatedImages);
    // onImageSelect(updatedImages);
    setActiveImage(null);
    setSelectedImages([]);
  };

  useEffect(() => {
    if (selectedImages?.length) {
      onImageSelect(selectedImages);
      // setSelectImage(selectedImages);
      setActiveImage(0);
    }
  }, [selectedImages]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          ":hover": {
            "& .image-picker-delete-overlay": {
              scale: "1 !important",
            },
          },
          background: "#DEDEDE",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "214px",
            border: 1,
            // borderColor: error || errors ? "error.main" : "secondary.main",
            borderColor: error ? "#d32f2f" : "#236D7D",
            borderStyle: "dashed",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            background: "#ffff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {(!!selectedImages?.length || previewImage) && (
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                // background: "#DEDEDE",
                background: "rgba(255,255,255,0.6)",
                zIndex: "999",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                scale: 0,
                transition: "0.1s",
              }}
              className="image-picker-delete-overlay"
            >
              <Stack spacing={1} direction={"row"}>
                <Tooltip title="Click to upload the file or drag and drop ">
                  <Fab color="primary" onClick={getRootProps().onClick}>
                    <UploadFile />
                  </Fab>
                </Tooltip>
                {previewImage && (
                  <Tooltip title="Open the document in a new tab.">
                    <Fab color="info" href={previewImage} target="_blank">
                      <OpenInNewIcon />
                    </Fab>
                  </Tooltip>
                )}
                {showDelete && (
                  <Fab
                    color="error"
                    onClick={() => {
                      // const updatedDate = selectedImages.filter((_, i) => activeImage !== i);
                      onImageSelect(selectedImages);
                      deleteImage();
                    }}
                  >
                    <DeleteForever />
                  </Fab>
                )}
              </Stack>
            </Box>
          )}
          {selectedImages?.length || previewImage ? (
            <ImagePreview imgUrl={selectedImages[0]?.imageDataUrl || previewImage} width="100%" height={"214px"} />
          ) : (
            <>
              <Stack {...getRootProps()} justifyContent="center" width="100%" alignItems="center" spacing={1}>
                <Fab color="primary" size="small">
                  <UploadIcon color="secondary" />
                </Fab>
                <Typography>Drag your file(s) to start uploading</Typography>
                <Divider style={{ width: "100%", color: "text.hint" }}>OR</Divider>

                <Button color="secondary">Browse files</Button>
                <Typography variant="caption" color="text.hint">
                  Only support .jpg, .png and .jpeg and pdf files
                </Typography>
              </Stack>
              <input {...getInputProps()} id="pickerInput" />
            </>
          )}
        </Box>
      </Box>
      {(error || errors) && (
        <Typography color="error" mt={0.5} fontSize="13px">
          {error || errors}
        </Typography>
      )}
    </>
  );
};

export default FilePicker;
