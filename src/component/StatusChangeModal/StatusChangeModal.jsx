"use client";
import { ModalWrapper } from "@/component";
import { ApiManager } from "@/helpers";
import {
  Avatar,
  TextField,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import { setToast } from "@/store/reducer";
import { useDispatch } from "react-redux";

const StatusChangeModal = ({
  open,
  handleClose,
  company,
  reason,
  setReason,
  updateStatus,
  loading,
}) => {
  const [error, setError] = useState("");
  const [inactivationDetails, setInactivationDetails] = useState({
    reason: "",
    adminName: "",
    inactivationDate: "",
    isCreatorInactive: false
  });
  const [fetching, setFetching] = useState(true);
  const isEvent = company?.type === "charity" || company?.type === "campaign";
  const isDeal = Object.keys(company).includes("dealName");
  const dispatch = useDispatch();
  const fetchInactiveReason = async () => {
    let path = `activation-change-log?page=1&perPage=1`
    if(isEvent){
      path += `&eventId=${company?.id}`
    }else if(isDeal){
      path += `&dealId=${company?.id}`
    }else {
      path += `&userId=${company?.id}`
    }

    try {
      setFetching(true);
      const { data } = await ApiManager({
        method: "get",
        path
        // path: `activation-change-log?page=1&perPage=1&eventId=${company?.id}`,
      });
      const details = data?.response?.details?.[0];
      setInactivationDetails({
        reason: details?.reason || "No reason provided",
        adminName:
          details?.admin?.firstName + " " + details?.admin?.lastName ||
          "Unknown",
        inactivationDate: details?.createdAt || "Date unavailable",
        isCreatorInactive: details?.isCreatorInactive
      });
    } catch (error) {
      console.error("Error fetching inactive reason:", error);
    } finally {

      setFetching(false);
    }
  };

  const handleStatusChange = () => {
    if(inactivationDetails?.isCreatorInactive){
      dispatch(setToast({ type: "error", message: `Parent ${isDeal?'Company':'NGO'} is disabled` }));
      return
    }
    if (reason.trim().length < 5 || reason.trim().length > 255) {
      setError("Reason must be between 5 and 255 characters long.");
    } else {
      setError("");
      updateStatus();
    }
  };

  useEffect(() => {
    if (open) {
      fetchInactiveReason();
    }
  }, [company, open]);

  return (
    <ModalWrapper open={open} handleClose={handleClose} title="Change Status">
      {fetching ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            gap={2}
          >
            <Avatar
              src={company?.profileImage || company?.bannerImage}
              alt={company?.name || company?.dealName || company?.title}
              sx={{ width: 80, height: 80 }}
            />
            <Typography variant="h6">
              {company?.name || company?.dealName || company?.title}
            </Typography>
          </Stack>

          {company?.activationStatus === "inactive" && (
            <Stack
              spacing={1}
              sx={{
                backgroundColor: "#f9f9f9",
                padding: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="textPrimary"
              >
                Inactivation Details
              </Typography>

              <Stack direction="column">
                <Typography
                  variant="body2"
                  color="textPrimary"
                  fontWeight="bold"
                >
                  Reason for inactivity:
                </Typography>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  textAlign="justify"
                >
                  {inactivationDetails.reason}
                </Typography>
              </Stack>

              <Stack direction="column">
                <Typography
                  variant="body2"
                  color="textPrimary"
                  fontWeight="bold"
                >
                  Inactivated by:
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {inactivationDetails.adminName}
                </Typography>
              </Stack>

              <Stack direction="column">
                <Typography
                  variant="body2"
                  color="textPrimary"
                  fontWeight="bold"
                >
                  Date of inactivation:
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {moment(inactivationDetails.inactivationDate).format(
                    "MMMM Do, YYYY"
                  )}
                </Typography>
              </Stack>
            </Stack>
          )}

          <TextField
            label="Reason"
            required
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={!!error}
            helperText={error}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleStatusChange}
              disabled={company?.isCreatorInactive ||loading}
            >
              {loading && <CircularProgress size={20} color='grey' sx={{mr:1}}/>}
              {company?.activationStatus === "active"
                ? "Inactivate"
                : "Activate"}
            </Button>
          </Stack>
        </Stack>
      )}
    </ModalWrapper>
  );
};

export default StatusChangeModal;
