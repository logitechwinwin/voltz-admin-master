"use client";
import React from "react";

import {
  Avatar,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { PrimaryButton, SecondaryButton } from "@/component";

const page = () => {


  return (
    <Container maxWidth="lg">
      <Card sx={{ p: 4 }}>
        <Stack gap={3}>
          <Typography variant="h4" fontWeight="bold">
            Add New Post
          </Typography>
          <Stack direction="row" gap={1} alignItems="center">
            <Avatar />
            <Typography fontWeight="SemiBold">Juma Youth Charity</Typography>
          </Stack>
          <TextField
            fullWidth
            multiline
            minRows={5}
          />

          <Stack alignItems="center" justifyContent="center">
            <Stack width="50%" direction="row" gap={5}>
              <SecondaryButton>Cancel</SecondaryButton>
              <PrimaryButton>Submit</PrimaryButton>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};

export default page;
