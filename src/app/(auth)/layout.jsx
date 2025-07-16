"use client";

import { Box, Card, Grid, Stack } from "@mui/material";
import Image from "next/image";

import { AuthImage } from "@/assets";

export default function AuthLayout({ children }) {
  return (
    <Box sx={Styles.box}>
      <Grid container>
        <Grid item xs={8} sx={{ display: { xs: "none", md: "flex" } }}>
          <Image style={Styles.image} src={AuthImage} alt="" />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={Styles.card}>
            <Stack justifyContent={"center"} alignItems={"center"} height={1}>
              {children}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

const Styles = {
  box: {
    height: "100vh",
    display: "flex",
    flexDirection: "row",
  },
  card: {
    height: "100%",
    overflow: "auto",
    marginLeft: { xs: "0px", md: "-20px" },
    borderRadius: 5,
    py: { xs: 3, sm: 9 },
    px: { xs: 1, sm: 15, md: 5, xl: 10 },
  },
  image: {
    maxHeight: "100vh",
    width: "100%",
    objectFit: "cover",
  },
};
