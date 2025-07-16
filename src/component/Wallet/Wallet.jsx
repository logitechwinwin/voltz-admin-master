"use client";

import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { ModalWrapper } from "..";
import { VoltzIcon } from "@/assets";

function MyWallet({ open, setOpen }) {
  const { walletBalance } = useSelector((state) => state.appReducer);

  return (
    <ModalWrapper
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          width: "fit-content",
          maxWidth: "90%",
          maxHeight: "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
      handleClose={() => setOpen(false)}
    >
      <Stack
        width="100%"
        height="100%"
        gap={4}
        justifyContent="center"
        alignItems="center"
        sx={{ p: 2 }}
      >
        <Typography variant="h6" fontWeight="Medium" color="text.hint">
          Your Available Voltz:
        </Typography>
        <Stack
          direction="row"
          gap={1}
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h4"
            fontWeight="SemiBold"
            sx={{ textAlign: "center" }}
          >
            {parseFloat(Number(walletBalance).toFixed(2)) || 0}
          </Typography>
          <Image
            src={VoltzIcon}
            alt="Voltz Icon"
            width={25}
            priority
            style={{ alignSelf: "center" }}
          />
        </Stack>
      </Stack>
    </ModalWrapper>
  );
}

export default MyWallet;
