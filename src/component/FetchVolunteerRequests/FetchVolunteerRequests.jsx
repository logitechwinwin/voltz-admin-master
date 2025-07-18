/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
  CloseOutlinedIcon,
  DoneOutlinedIcon,
  ReplayOutlinedIcon,
  Voltz,
  VoltzIcon,
} from "@/assets";
import { SelectBox, TableWrapper } from "@/component";
import DialogBox from "@/component/DialogBox/DialogBox";
import BasicMenu from "@/component/Menu/Menu";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast, setWalletBalance } from "@/store/reducer";
import Utils from "@/Utils";
import UITable from "../TableContainer/TableContainer";

const VolunteersRequest = ({ role }) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [events, setEvents] = useState([]);
  const [editRequest, setEditRequest] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const dispatch = useDispatch();
  const matches = useMediaQuery("(max-width:430px)");
  const isCampaignManager = role === "campaign_manager";
  const { user } = useSelector((state) => state.appReducer);

  useEffect(() => {
    if (!!editRequest && !openModal) {
      getAllRequests();
    }
  }, [openModal]);

  useEffect(() => {
    const interval = setInterval(getAllRequests, 2500);
    // getAllRequests();
    return () => clearInterval(interval);
  }, [page, status, itemsPerPage, selectedEvent]);

  useEffect(() => {
    getAllEvents();
  }, []);

  const getAllRequests = async () => {
    let path = `volunteer-requests?page=${page + 1}&perPage=${itemsPerPage}`;
    if (status !== "all") path += `&status=${status}`;
    if (selectedEvent) path += `&eventId=${selectedEvent}`;
    try {
      let { data } = await ApiManager({ path });
      setRequests(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoadingRequest(false);
    }
  };
  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const getAllEvents = async () => {
    setLoading(true);
    let path;
    if (isCampaignManager) {
      path = `events?campaignManagerId=${user?.id}&page=1&perPage=999999`;
    } else {
      path = `events?ngoId=${user?.id}&page=1&perPage=999999`;
    }
    try {
      let { data } = await ApiManager({
        path,
      });
      console.log("data?.message", data);
      const filteredEvents = data?.response?.details?.items?.map((event) => ({
        id: event?.id,
        label: event?.title,
      }));
      setEvents(filteredEvents);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  const RenderRow = ({ data, setOpen }) => {
    const [disable] = useState(data?.status);
    return (
      <TableRow>
        <TableCell>
          <Link
            href={`${process.env.NEXT_PUBLIC_WEB_URL}volunteer?value=0&userId=${data?.user?.id}`}
            target="_blank"
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Avatar variant="rounded" src={data?.user?.profileImage} />
              <Typography>
                {data?.user?.firstName
                  ? Utils.limitStringWithEllipsis(
                      data?.user?.firstName + " " + data?.user?.lastName,
                      20
                    )
                  : "-"}
              </Typography>
            </Stack>
          </Link>
        </TableCell>
        <TableCell>{data?.event?.title || "-"}</TableCell>
        {/* <TableCell>{data?.event?.startDate ? moment(data?.event?.startDate).format("DD/MM/YYYY  hh:mm") : "-"}</TableCell> */}
        {/* <TableCell>{data?.event?.endDate ? moment(data?.event?.endDate).format("DD/MM/YYYY  hh:mm") : "-"}</TableCell> */}
        <TableCell sx={{ textAlign: "center" }}>
          {data?.quotedHours} Hours
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {data?.actualHours ? data?.actualHours + " Hours" : "-"}
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            gap={1}
            justifyContent="center"
            alignItems="center"
          >
            {data?.actualHours && data?.event?.voltzPerHour ? (
              <>
                <Typography color="secondary.main" fontWeight="bold">
                  {data.actualHours * data.event.voltzPerHour}
                </Typography>
                <Image src={Voltz} alt="logo" height={18} width={18} priority />
              </>
            ) : (
              <Typography color="secondary.main" fontWeight="bold">
                -
              </Typography>
            )}
          </Stack>
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "Medium",
            textTransform: "capitalize",
            color:
              disable === "accepted"
                ? "#4CAF50"
                : disable === "rejected"
                  ? "error.main"
                  : "rgba(6, 176, 186, 1)",
          }}
        >
          {disable}
        </TableCell>
        <TableCell>
          <BasicMenu setOpenMenu={setOpen} disabled={disable === "accepted"}>
            <MenuItem
              onClick={() => {
                setOpenModal(true);
                setEditRequest(data);
              }}
            >
              Edit
            </MenuItem>
          </BasicMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Grid container spacing={{ xs: 2, md: 0 }} alignItems="center" mb={4}>
        <Grid item xs={12} sm={5} md={7} lg={8}>
          <Typography variant="h4" fontWeight="SemiBold">
            Voltz Requests
          </Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={5} lg={4}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="flex-end"
            gap={2}
          >
            <Autocomplete
              sx={{ flex: 1 }}
              fullWidth
              id="tags-outlined"
              options={events}
              getOptionLabel={(option) => option?.label}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  name="events"
                  {...params}
                  label="Events"
                  placeholder="Select Events"
                />
              )}
              // value={formData?.products?.length ? formData?.products?.map((product) => ({ id: product.id, label: product?.name })) : []}
              onChange={(e, val) => {
                setLoadingRequest(true);
                setSelectedEvent(val?.id);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Box>
              <SelectBox
                label="Requests"
                fullWidth
                optionRenderKeys={{
                  name: "name",
                  value: "value",
                }}
                value={status}
                items={[
                  { name: "All", value: "all" },
                  { name: "Accepted", value: "accepted" },
                  { name: "Pending", value: "pending" },
                  { name: "Rejected", value: "rejected" },
                ]}
                onChange={(e) => {
                  setLoadingRequest(true);
                  setStatus(e.target.value);
                }}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <UITable
        headings={thLabels}
        spanTd={thLabels?.length}
        isContent={requests?.totalItems}
        loading={loading || loadingRequest}
        handlePageChange={(_, v) => setPage(v)}
        handleRowsPerPageChange={handleRowsPerPageChange}
        itemsPerPage={itemsPerPage}
        count={requests?.totalItems}
        page={page}
      >
        {requests?.details?.map((request, i) => (
          <RenderRow setOpen={setOpen} key={i} index={i} data={request} />
        ))}
      </UITable>
      <DialogBox
        request={editRequest}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </Container>
  );
};

export default VolunteersRequest;

let thLabels = [
  "Volunteer",
  "Events",
  "Requested Hours",
  "Accepted Hours",
  "Voltz Given",
  "Status",
  "Action",
];

const Style = {
  table: {
    backgroundColor: "white",
    py: 2,
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 118px)",
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
