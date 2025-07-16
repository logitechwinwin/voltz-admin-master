"use client";

import React from "react";

import { CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";

function Loader() {
  let { loader } = useSelector((state) => state.appReducer);

  if (!loader) {
    return <></>;
  }
  return (
    <Box sx={loaderStyle}>
      <CircularProgress size={60} color="primary" />
    </Box>
  );
}

export default Loader;

const loaderStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100vh",
  backgroundColor: "rgba(255,255,255,0.75)",
  zIndex: "9999999999999",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
