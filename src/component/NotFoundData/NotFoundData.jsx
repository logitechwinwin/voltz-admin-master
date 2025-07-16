"use client";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { NoRecordFound } from "@/assets";
import React from "react";

function NotFoundData({ title }) {
  return (
    <Stack width={1} alignItems="center" gap={2}>
      <Image src={NoRecordFound} alt="" />
      <Typography variant="h6">{title}</Typography>
    </Stack>
  );
}

export default NotFoundData;
