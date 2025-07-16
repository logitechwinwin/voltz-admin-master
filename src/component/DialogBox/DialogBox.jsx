/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { Avatar, Card, Dialog, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import { Counter } from "..";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import { CloseIcon, Voltz } from "@/assets";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast, setWalletBalance } from "@/store/reducer";
import Utils from "@/Utils";

const DialogBox = ({ open, onClose, request }) => {
  const responsive = useMediaQuery("(max-width:440px)");
  const [hours, setHours] = useState(0);
  const { walletBalance } = useSelector((state) => state.appReducer);
  const requestedVoltz = request?.quotedHours * request?.event?.voltzPerHour;
  const dispatch = useDispatch();
  useEffect(() => {
    setHours(request?.quotedHours);
  }, [request?.quotedHours]);

  const handleSubmit = async (status) => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "patch",
        path: `volunteer-requests/${request?.id}`,
        params: {
          ...(status === "accepted" ? { status: status, actualHours: hours } : { status }),
        },
      });
      console.log("handlSubmit", data);
      if (status === "accepted") {
        dispatch(setWalletBalance(Number(walletBalance) - Number(hours * request?.event?.voltzPerHour)));
      }
      // params: { status: status, actualHours: hours } });
      onClose();
      dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      if (error?.response?.status == 400) {
        dispatch(setToast({ type: "error", message: error?.response?.data?.message }));
      } else {
        dispatch(setToast({ type: "error", message: error?.message }));
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };

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
      <Card sx={{ px: 4, pb: 5, boxShadow: "none" }}>
        <Stack gap={2}>
          <Stack alignItems="center" width={1} gap={1}>
            <Avatar sx={{ height: "96px", width: "96px" }} src={request?.user?.profileImage} />
            <Typography fontWeight="bold" variant="h6">
              {Utils.limitStringWithEllipsis(request?.user?.firstName + " " + request?.user?.lastName, 20)}
            </Typography>
          </Stack>
          <Stack alignItems="center" flexWrap="wrap" width={1} direction="row" gap={1}>
            <Typography variant="body1" whiteSpace="nowrap">
              Requesting voltz
            </Typography>
            <Stack direction="row" bgcolor="#FAFAFA" gap={1} sx={{ px: 1, borderRadius: 10 }}>
              <Typography color="secondary.main" variant="h6" fontWeight="bold">
                {requestedVoltz}
              </Typography>
              <Image src={Voltz} alt="" />
            </Stack>
            <Typography variant="body1">
              for <span style={{ fontWeight: "bold" }}>{request?.quotedHours} hours</span>{" "}
            </Typography>
          </Stack>
          <Stack gap={1}>
            <Typography variant="body1" fontWeight="bold">
              Hours Worked
            </Typography>
            <Stack direction="row" maxWidth={!responsive ? "45%" : "100%"} alignItems="center" gap={1}>
              <Counter hours={hours} setHours={setHours} />
            </Stack>
          </Stack>
          <Stack gap={1}>
            <Typography variant="body1" fontWeight="bold">
              Voltz Earned
            </Typography>
            <Stack direction="row" gap={1}>
              <Typography variant="h6">{hours * request?.event?.voltzPerHour || 0}</Typography>
              <Image src={Voltz} alt="voltz" />
            </Stack>
          </Stack>
          <Stack direction="row" gap={2} pt={2}>
            {request?.status === "rejected" ? (
              <>
                <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                <PrimaryButton onClick={() => handleSubmit("accepted")}>Approve</PrimaryButton>
              </>
            ) : (
              <>
                <SecondaryButton onClick={() => handleSubmit("rejected")}>Reject</SecondaryButton>
                <PrimaryButton onClick={() => handleSubmit("accepted")}>Approve</PrimaryButton>
              </>
            )}
          </Stack>
        </Stack>
      </Card>
    </Dialog>
  );
};

export default DialogBox;
