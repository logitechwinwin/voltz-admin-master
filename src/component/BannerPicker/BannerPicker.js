/* eslint-disable no-unused-vars */
"use client";
// import React, { useEffect, useState } from "react";

// import { Box, Paper, Typography } from "@mui/material";

// import ImagePreview from "./ImagePreview";
// import useImagePicker from "@/hooks/useImagePicker";

// const BannerPicker = ({
//   height = "300px",
//   onImageSelect = () => {},
//   formError,
// }) => {
//   const { getRootProps, getInputProps, isDragActive, errors, selectedImage } =
//     useImagePicker();

//   const [selectImage, setSelectedImage] = useState({});

//   useEffect(() => {
//     setSelectedImage(selectedImage);
//     onImageSelect(selectedImage);
//   }, [selectedImage]);

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: height,
//         background: "#DEDEDE",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: "10px",
//         position: "relative",
//         overflow: "hidden",
//       }}
//       {...getRootProps()}
//     >
//       {isDragActive && (
//         <Box
//           sx={{
//             position: "absolute",
//             width: "100%",
//             height: "100%",
//             background: "#DEDEDE",
//             zIndex: "1",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h4">Drop the image here</Typography>
//         </Box>
//       )}
//       {selectedImage && (
//         <ImagePreview
//           imgUrl={selectedImage?.imageDataUrl}
//           width="100%"
//           height={height}
//         />
//       )}
//       {!selectedImage && (
//         <Paper
//           variant="outlined"
//           elevation={5}
//           sx={{
//             width: "182.27px",
//             height: "121.93px",
//             borderRadius: "14px",
//             display: "Flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//           }}
//         >
//           <CloudUploadOutlinedIcon fontSize="large" color="secondary" />
//           <Typography fontSize="14px" fontWeight="500">
//             Upload Banner Image
//           </Typography>
//         </Paper>
//       )}
//       {(formError || errors) && (
//         <Box sx={{ position: "absolute", top: "15px", zIndex: 99 }}>
//           <Typography color="error" textAlign="center">
//             {formError || errors}
//           </Typography>
//         </Box>
//       )}
//       <input {...getInputProps()} id="pickerInput" />
//     </Box>
//   );
// };

// export default BannerPicker;

import React, { useEffect, useState } from "react";

// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { DeleteForever, UploadFile } from "@mui/icons-material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, Button, CardActionArea, Divider, Fab, Fade, FormHelperText, Paper, Stack, Tooltip, Typography, Zoom } from "@mui/material";

import ImagePreview from "./ImagePreview";
import { AddIcon, ArrowUpwardIcon, CloseIcon } from "@/assets";
import useImagePicker from "@/hooks/useImagePicker";

const BannerPicker = ({
  title,
  height = "214px",
  error,
  onImageSelect = () => {},
  formError,
  multiple,
  maxFiles = 4,
  previewImage,
  type,
  value,
  showDelete = true,
  disable = false,
  dummyImg,
}) => {
  const { getRootProps, getInputProps, isDragActive, errors, selectedImages, setSelectedImages } = useImagePicker(false);

  const [medias, setMedias] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    if (selectedImages?.length && selectedImages?.length <= maxFiles) {
      setMedias(selectedImages);
      onImageSelect(selectedImages);
      setErrorState("");
      setActiveImage(0);
    }

    if (selectedImages?.length && selectedImages?.length > maxFiles) {
      setTimeout(() => {
        setErrorState("");
      }, 7000);
      return setErrorState("To many files");
    }
  }, [selectedImages]);

  useEffect(() => {
    if (!value) {
      setSelectedImages([]);
      setMedias([]);
    }
  }, [value]);

  const deleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    // setMedias(updatedImages);
    // onImageSelect(updatedImages);
    setSelectedImages(updatedImages);
  };

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          ...(!disable && {
            ":hover": {
              "& .image-picker-delete-overlay": {
                scale: "1 !important",
              },
            },
            cursor: "pointer",
          }),
          ...(!disable && {
            background: "#DEDEDE",
          }),
        }}
      >
        {(!!medias?.length || previewImage) && (
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              // background: "#DEDEDE",
              background: "rgba(255,255,255,0.6)",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              scale: 0,
              transition: "0.1s",
            }}
            className="image-picker-delete-overlay"
          >
            <Stack spacing={1} direction={"row"}>
              {!disable && (
                <Tooltip title="Click to upload the file or drag and drop ">
                  <Fab color="primary" onClick={getRootProps().onClick}>
                    {selectedImages?.length > 0 && multiple ? <AddIcon /> : <UploadFile />}
                  </Fab>
                </Tooltip>
              )}
              {/* <Fab
                color="error"
                onClick={() => {
                  const updatedDate = medias.filter((_, i) => activeImage !== i);
                  onImageSelect(updatedDate);
                  setMedias(updatedDate);
                  deleteImage(activeImage);
                }}
              >
                <DeleteForever />
              </Fab> */}
            </Stack>
          </Box>
        )}
        <Box
          sx={{
            width: "100%",
            height: height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            position: "relative",
            overflow: "hidden",
            ...(!disable && {
              border: error || !!errors?.length ? "1px solid #d32f2f" : "1px dashed #236D7D",
            }),
          }}
          {...(!disable && getRootProps())}
        >
          {isDragActive && (
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "#DEDEDE",
                zIndex: "3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Drop the image here</Typography>
            </Box>
          )}
          {(!!medias?.length || previewImage) && (
            <>
              <ImagePreview
                imgUrl={previewImage || medias[activeImage]?.imageDataUrl}
                width="100%"
                height={height}
                disable={disable}
                dummyImg={dummyImg}
              />
              {(error || errors) && (
                <Box sx={{ position: "absolute", top: "82%", zIndex: 99 }}>
                  <Typography color="error" textAlign="center" fontSize="13px">
                    {error || errors}
                  </Typography>
                </Box>
              )}
            </>
          )}

          {!(medias?.length || previewImage) && (
            <>
              <Paper
                variant="outlined"
                elevation={5}
                sx={{
                  width: "182.27px",
                  height: "121.93px",
                  borderRadius: "14px",
                  display: "Flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CloudUploadOutlinedIcon fontSize="large" color="secondary" />
                <Typography fontSize="14px" fontWeight="500">
                  {title ? title : `Upload Banner Image`}
                </Typography>
              </Paper>
              {/* <Box>
                <Zoom in={!!errors?.length || errorState || error}>
                  <FormHelperText error>{`${error}*`}</FormHelperText>
                </Zoom>
              </Box> */}
              {(error || errors) && (
                <Box sx={{ position: "absolute", top: "82%", zIndex: 99 }}>
                  <Typography color="error" textAlign="center" fontSize="13px">
                    {error || errors}
                  </Typography>
                </Box>
              )}
            </>
          )}

          {!disable && <input {...getInputProps()} id="pickerInput" />}
        </Box>
      </Box>

      {/* <Zoom in={!!errors?.length || errorState || error}>
        <FormHelperText error>{`${error}*`}</FormHelperText>
      </Zoom> */}
      {medias.length > 1 && (
        <Stack sx={{ overflow: "auto", p: 1 }} direction={"row"} spacing={1} mt={1}>
          {medias?.map((each, i) => (
            <Box key={i} sx={{ position: "relative" }}>
              <CardActionArea
                sx={{
                  border: activeImage === i ? 5 : 3,
                  borderColor: activeImage === i ? "secondary.main" : "primary.main",
                  borderRadius: "10px",
                  width: "150px",
                  height: "90px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  minWidth: "150px",
                  overflow: "hidden",
                }}
                onClick={() => setActiveImage(i)}
              >
                <Box component="img" src={each?.banner_image_url || each?.imageDataUrl} sx={{ width: "100%", height: "100%" }} />
              </CardActionArea>
              <CloseIcon
                sx={{
                  position: "absolute",
                  backgroundColor: "#ddd5d5",
                  cursor: "pointer",
                  top: "-3px",
                  right: "-3px",
                  borderRadius: "15px",
                  color: "grey",
                  fontSize: "17px",
                }}
                onClick={() => {
                  deleteImage(i);
                }}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default BannerPicker;
