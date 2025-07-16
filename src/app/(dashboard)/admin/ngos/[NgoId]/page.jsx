"use client";
import React, { useState } from "react";

import { Avatar, Container, MenuItem, Stack, TableCell, TableRow, Typography } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

import { Voltz } from "@/assets";
import { BasicMenu, DeleteDialogBox, TableWrapper } from "@/component";

function NgoHistory() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const RenderRow = ({ setOpen }) => {
    return (
      <TableRow>
        <TableCell>{moment().format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>

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
          </BasicMenu>
        </TableCell>
      </TableRow>
    );
  };
  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Stack gap={3}>
        <Typography variant="h4" fontWeight="SemiBold">
          History
        </Typography>
        <Stack direction="row" gap={1} alignItems="center">
          <Avatar sx={{ height: 66, width: 66 }} />
          <Stack gap={0}>
            <Typography fontWeight="bold">John Doe</Typography>
            <Typography color="text.hint">John Doe</Typography>
          </Stack>
        </Stack>
        <TableWrapper
          isContent={true}
          thContent={["Date of Transaction", "Voltz", "Action"]}
          total={20}
          page={1}
          perPage={5}
          rowsPerPage={5}
          showPagination={true}
        >
          {Array(8)
            .fill()
            .map((_, i) => (
              <RenderRow key={i} setOpen={setOpen} />
            ))}
        </TableWrapper>
        <DeleteDialogBox title="NGO" name="RHMC" open={open} onClose={() => setOpen(false)} />
      </Stack>
    </Container>
  );
}

export default NgoHistory;

const Style = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
