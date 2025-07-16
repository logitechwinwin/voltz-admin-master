/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
"use client";
import { Voltz } from "@/assets";
import {
  SecondaryButton,
  SelectBox,
  StatusButton,
  TableWrapper,
} from "@/component";
import BasicMenu from "@/component/Menu/Menu";
import Utils from "@/Utils";
import { Add } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Volunteers = () => {
  const matches = useMediaQuery("(max-width:430px)");
  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Stack gap={1} mb={"30px"} justifyContent="space-between">
        <Typography variant="h4" fontWeight="SemiBold">
          Volunteers
        </Typography>
        <Typography variant="h6" fontWeight="SemiBold" color='text.hint'>
          Fresh Fruit & Vegetables
        </Typography>
      </Stack>
      <TableWrapper
        isContent={true}
        thContent={["Volunteers", "Date Claimed", "Voltz Spent", "Action"]}
        total={20}
        page={1}
        perPage={5}
        rowsPerPage={5}
        showPagination={true}
      >
        {Array(8)
          .fill()
          .map((_, i) => (
            <RenderRow key={i} />
          ))}
      </TableWrapper>
    </Container>
  );
};

export default Volunteers;

const RenderRow = () => {
  const [open, setOpen] = useState(false);
  return (
    <TableRow>
      <TableCell sx={{ maxWidth: "140px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={{ xs: 0.5, sm: 1, md: 2 }}
        >
          <Avatar />
          <Typography fontWeight="Medium">
            {Utils.limitStringWithEllipsis("Bob Bernou", 16)}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{moment().format("MMM. D,YYYY")}</TableCell>
      <TableCell>
        <Stack
          direction="row"
          bgcolor="#FAFAFA"
          gap={1}
          alignSelf="center"
          mx="auto"
          sx={{ px: 1, borderRadius: 10, maxWidth: "fit-content" }}
        >
          <Typography color="secondary.main" variant="body1" fontWeight="bold">
            10
          </Typography>
          <Image src={Voltz} height={20} width={20} alt="logo" />
        </Stack>
      </TableCell>

      <TableCell>
        <Button
          color="warning"
          sx={{
            boxShadow: "none",
            fontWeight: "regular",
          }}
          variant="contained"
        >
          View Profile
        </Button>
      </TableCell>
    </TableRow>
  );
};

const Style = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
