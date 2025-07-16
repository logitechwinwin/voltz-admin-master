import React from "react";
import { Box } from "@mui/material";
import Head from "next/head";

import { PdfIcon } from "@/assets";

const ImagePreview = ({ imgUrl, width, height, disable, dummyImg, ...props }) => {
  const isPdf = typeof imgUrl === "string" && imgUrl.endsWith(".pdf");
  const displayImageUrl = isPdf ? PdfIcon.src : imgUrl;
  return (
    <>
      {Boolean(imgUrl) && (
        <Head>
          <link rel="preload" href={displayImageUrl} as="image" />
        </Head>
      )}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          background: `url(${displayImageUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "50%",
          ...(!dummyImg && { filter: "blur(50px)" }),
        }}
        {...props}
      ></Box>
      <Box sx={{ zIndex: 1 }}>
        <Box component={"img"} src={displayImageUrl} sx={{ width: "100%", height: "100%", maxWidth: width, maxHeight: height }} />
      </Box>
    </>
  );
};

export default ImagePreview;
