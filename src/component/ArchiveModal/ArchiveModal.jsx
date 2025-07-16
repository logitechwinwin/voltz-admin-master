import React from "react";

import { Card, Dialog, IconButton, Stack, Typography } from "@mui/material";

import PrimaryButton from "../PrimaryButton/PrimaryButton";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import { CloseIcon } from "@/assets";

const ArchiveModal = ({ open, onClose, title, message, name, onClick }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "20px",
        },
      }}
    >
      <IconButton sx={{ m: 1, ml: "auto" }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Card sx={{ px: 3, pb: 5, boxShadow: "none" }}>
        <Stack gap={1} alignItems="center">
          <Typography fontWeight="bold" variant="h6">
            {title}
          </Typography>
          <Typography>{message}</Typography>

          <Stack width="70%" direction="row" gap={2} pt={3}>
            <PrimaryButton
              onClick={() => {
                onClick();
                onClose();
              }}
            >
              Yes
            </PrimaryButton>
            <SecondaryButton onClick={() => onClose()}>No</SecondaryButton>
          </Stack>
        </Stack>
      </Card>
    </Dialog>
  );
};

export default ArchiveModal;
