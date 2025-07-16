"use client";
import React, { useState } from "react";

import { Avatar, Box, Container, MenuItem, Stack, TableCell, TableRow, Typography } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

import { Voltz } from "@/assets";
import { BasicMenu, DeleteDialogBox, TableWrapper } from "@/component";

function CompanyHistory() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack gap={3}>
        <Typography variant="h4" fontWeight="SemiBold">
          History
        </Typography>

        <Stack direction="row" gap={1} alignItems="center">
          <Avatar sx={{ height: 66, width: 66 }} />
          <Stack gap={0}>
            <Typography fontWeight="bold">McDonalds</Typography>
          </Stack>
        </Stack>
        <Box sx={Style.table}>
          <TableWrapper
            isContent={true}
            thContent={["Date", "Name Of Deal", "Number Of Times Availed", "Voltz Needed Per Deal", "Action"]}
            total={20}
            page={1}
            perPage={5}
            rowsPerPage={5}
            showPagination={true}
          >
            {Array(8)
              .fill()
              .map((_, i) => (
                <RenderRow key={i} setOpen={setOpen} setOpenMenu={setOpenMenu} openMenu={openMenu} />
              ))}
          </TableWrapper>
          <DeleteDialogBox title="Company" name="McDonalds" open={open} onClose={() => setOpen(false)} />
        </Box>
      </Stack>
    </Container>
  );
}

export default CompanyHistory;

const RenderRow = ({ setOpen, setOpenMenu, openMenu }) => {
  return (
    <TableRow>
      <TableCell>{moment().format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>
      <TableCell>McDonalds Deal</TableCell>

      <TableCell>200</TableCell>
      <TableCell>
        <Stack direction="row" bgcolor="#FAFAFA" gap={1} sx={{ px: 1, borderRadius: 10, maxWidth: "fit-content" }}>
          <Typography color="secondary.main" variant="body1" fontWeight="bold">
            10
          </Typography>
          <Image src={Voltz} height={20} width={20} alt="logo" />
        </Stack>
      </TableCell>

      <TableCell>
        <BasicMenu setOpenMenu={setOpenMenu} openMenu={openMenu}>
          <MenuItem>Edit</MenuItem>

          <MenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            <Link href="#">Delete</Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            <Link href="#">History</Link>
          </MenuItem>
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
