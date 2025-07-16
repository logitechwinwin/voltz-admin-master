/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
"use client";
import { MoreHorizIcon, Voltz } from "@/assets";
import { SelectBox, TableWrapper } from "@/component";
import HeaderSearchBar from "@/component/HeaderSearchBar/HeaderSearchBar";
import BasicMenu from "@/component/Menu/Menu";
import Utils from "@/Utils";
import {
  Avatar,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Volunteers = () => {
  const matches = useMediaQuery("(max-width:430px)");

  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Grid container spacing={{ xs: 2, md: 0 }} alignItems="center" mb={4}>
        <Grid item xs={12} sm={12} md={5} lg={6}>
          <Typography variant="h4" fontWeight="SemiBold">
            Volunteers
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={7} lg={6}>
          <Stack gap={2} direction={matches ? "column" : "row"}>
            <HeaderSearchBar
              SearchStyle={{
                borderRadius: "5px",
                padding: "5px 18px",
                width: { xs: "100%", sm: "auto" },
              }}
              filter={false}
            />
            <SelectBox
              styles={{ width: { xs: "100%", sm: "60%" } }}
              label="Event Name"
            />
          </Stack>
        </Grid>
      </Grid>

      <TableWrapper
        isContent={true}
        thContent={[
          "Volunteer",
          "Date",
          "Start Time",
          "End Time",
          "Voltz Earned",
          "Action",
        ]}
        total={20}
        page={1}
        perPage={5}
        rowsPerPage={5}
        showPagination={true}
      >
        {Array(8)
          .fill()
          .map((_, i) => (
            <RenderRow key={i}/>
          ))}
      </TableWrapper>
    </Container>
  );
};

export default Volunteers;

const RenderRow = () => {
  const [open, setOpen] = useState(false)
  return (
    <TableRow >
      <TableCell sx={{ maxWidth: '140px' }}>
        <Stack direction="row" alignItems="center" justifyContent='center' gap={2}>
          <Avatar />
          <Typography fontWeight='Medium'>{Utils.limitStringWithEllipsis('John Doe', 16)}</Typography>
        </Stack>
      </TableCell>
      <TableCell >{moment().format("MMM. D, YYYY")}</TableCell>
      <TableCell>00:00</TableCell>
      <TableCell>00:00</TableCell>
      <TableCell>
        <Stack direction="row" justifyContent='center' gap={1}>
          <Typography color="secondary.main" fontWeight="bold">
            10
          </Typography>
          <Image src={Voltz} alt="logo"/>
        </Stack>
      </TableCell>
      <TableCell>
        <BasicMenu>
          <MenuItem onClick={() => {
            setOpen(true)
          }}>Edit</MenuItem>
          <MenuItem onClick={() => setOpen(false)}>Delete</MenuItem>
        </BasicMenu>
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
