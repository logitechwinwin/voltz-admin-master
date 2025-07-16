"use client";

import { Stack } from "@mui/material";
import Image from "next/image";

import { BlobSplash, BlobSplashDown, LogoSplash } from "@/assets";

const SplashScreen = () => {
  return (
    <Stack sx={{ minHeight: "100vh", bgcolor: "#d4d4d4", userSelect: "none" }} justifyContent="center" alignItems="center" position="relative">
      <Image src={BlobSplash} className="image-top-right" alt="" width="0" height="0" />
      <Image
        src={LogoSplash}
        style={{ width: 250, height: 250, userSelect: "none" }}
        alt="Logo Splash Center"
        className="image-center"
        width="0"
        height="0"
      />
      <Image src={BlobSplashDown} alt="Blob Splash Bottom Left" className="image-bottom-left" width="0" height="0" />
    </Stack>
  );
};

export default SplashScreen;
