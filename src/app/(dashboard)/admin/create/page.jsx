"use client";
import React from "react";

import { Container, Grid, Stack, Typography } from "@mui/material";

import {
  Heading,
  InputField,
  PrimaryButton,
  SecondaryButton,
} from "@/component";


const Create = () => {
  const handleInput = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
  }
  return (
    <Container>
      <Stack py={5}>
        <Heading text="Create Super Admin Account" />

        <InputContainer title="Super Admin Details">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputField label="Name" onChange={handleInput} />
            </Grid>
          </Grid>
        </InputContainer>

        <InputContainer title="Account Details">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputField label="Username" onChange={handleInput} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField label="Email" onChange={handleInput} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField label="Enter Password" onChange={handleInput} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField label="Re Enter Password" onChange={handleInput} />
            </Grid>
          </Grid>
        </InputContainer>

        <InputContainer>
          <Stack
            direction="row"
            justifyContent="center"
            width={{ xs: "100%", sm: "60%", md: "50%" }}
            mx="auto"
            gap={2}
          >
            <SecondaryButton>Cancel</SecondaryButton>
            <PrimaryButton>Submit</PrimaryButton>
          </Stack>
        </InputContainer>
      </Stack>
    </Container>
  );
};

export default Create;

const InputContainer = ({ title, children }) => {
  return (
    <Stack mt={3}>
      <Typography variant="h6" color="text.hint" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
};
