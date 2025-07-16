import React from "react";

import { CircularProgress, Stack, Typography } from "@mui/material";

import { ModalWrapper, PrimaryButton, SecondaryButton } from "..";

const DeleteModal = ({ open, setOpen, loading = false, deleteId, callback }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <ModalWrapper open={open} handleClose={handleClose}>
      <Stack gap={1} mt="10px">
        <Typography variant="h5" fontWeight="bold">
          Are You Sure?
        </Typography>
        <Typography>{`Are you sure you want to delete the ${deleteId?.firstName} ${deleteId?.lastName}?`}</Typography>
        <Stack direction="row" gap={2} width={"80%"} alignSelf="center" mt={"10px"}>
          <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
          <PrimaryButton disabled={loading} onClick={callback}>
            {loading ? <CircularProgress sx={{ color: "#fff" }} size={20} /> : `Submit`}
          </PrimaryButton>
        </Stack>
      </Stack>
    </ModalWrapper>
  );
};

export default DeleteModal;
