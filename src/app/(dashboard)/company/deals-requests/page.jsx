/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";

import { Delete } from "@mui/icons-material";
import {
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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import {
  CloseOutlinedIcon,
  DoneOutlinedIcon,
  ReplayOutlinedIcon,
  Voltz,
  VoltzIcon,
} from "@/assets";
import { DatePicker, SelectBox, TableWrapper } from "@/component";
import DialogBox from "@/component/DialogBox/DialogBox";
import BasicMenu from "@/component/Menu/Menu";
import { ApiManager } from "@/helpers";
import useQueryParams from "@/hooks/useQueryParams";
import { handleLoader, setToast, setWalletBalance } from "@/store/reducer";
import Utils from "@/Utils";
import UITable from "@/component/TableContainer/TableContainer";

const DealsRequests = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deals, setDeals] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [dealId, setDealId] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const dispatch = useDispatch();
  const { queryParams, setQueryParams, clearQueryParams } = useQueryParams({
    from: null,
    to: null,
    status: "all",
    page: 0,
  });
  const [filter, setFilter] = useState(queryParams);
  // const [fromTo, setFromTo] = useState({
  //   from: "",
  //   to: "",
  // });
  const matches = useMediaQuery("(max-width:430px)");
  const { user, walletBalance } = useSelector((state) => state.appReducer);
  useEffect(() => {
    getAllRequests();
  }, [filter, itemsPerPage]);

  const getAllRequests = async () => {
    // dispatch(handleLoader(true));
    setLoading(true);
    let query = Utils.buildQueryString({
      ...filter,
      page: filter?.page + 1,
    });

    // let path = `deal-request?page=${page}&perPage=6`;
    let path = `deal-request?${query}&perPage=${itemsPerPage}`;
    // if (status !== "all") path += `&status=${status}`;
    // if (fromTo?.from !== "") path += `&from=${moment(fromTo?.from).toISOString()}`;
    // if (fromTo?.to !== "") path += `&to=${moment(fromTo?.to).toISOString()}`;

    try {
      let { data } = await ApiManager({ path });
      setDeals(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      // dispatch(handleLoader(false));
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilter({ page: 0, from: null, to: null, status: "all" });
    clearQueryParams()
  };

  const handleFilter = (e) => {
    let { name, value } = e.target;
    let dateInUtc;
    if (name === "from") {
      dateInUtc = moment(value).startOf("d").toISOString();
      setFilter((prev) => ({
        ...prev,
        [name]: dateInUtc,
      }));
      setQueryParams(name, dateInUtc);
    } else if (name === "to") {
      dateInUtc = moment(value).endOf("d").toISOString();
      setFilter((prev) => ({
        ...prev,
        [name]: dateInUtc,
      }));
      setQueryParams(name, dateInUtc);
    } else {
      setFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
      setQueryParams(name, value);
    }
  };
  const handlePagination = (_, count) => {
    setFilter((prev) => ({
      ...prev,
      page: count,
    }))
    setQueryParams("page", count);
  };
  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const downloadDeal = async () => {
    try {
      let query = Utils.buildQueryString({
        ...filter,
        page: filter?.page + 1,
      });
      let path = `deal-request/download?perPage=6&${query}`;
      // if (status !== "all") path += `&status=${status}`;
      // if (fromTo?.from !== "") path += `&from=${moment(fromTo?.from).toISOString()}`;
      // if (fromTo?.to !== "") path += `&to=${moment(fromTo?.to).toISOString()}`;

      const response = await ApiManager({
        method: "get",
        path,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "deal.csv"; // Set the file name for the download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const RenderRow = ({
    data,
    setDeals,
    text = "Cancelled",
    index,
    setOpen,
  }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [loader, setLoader] = useState(false);
    const { deal, requestor } = data;

    const handleRequest = async (deal) => {
      setLoader(true);
      try {
        let { data } = await ApiManager({
          method: "patch",
          path: `deal-request/${deal?.id}`,
          params: { status: deal?.status },
        });
        console.log("data?.message", data);
        if (deal?.status === "accepted") {
          dispatch(
            setWalletBalance(Number(walletBalance) + Number(deal?.voltz))
          );
        }
        setDeals((prev) => ({
          ...prev,
          details: prev.details.map((item, i) =>
            i === index ? { ...item, status: deal?.status } : item
          ),
        }));
      } catch (error) {
        dispatch(setToast({ type: "error", message: error?.message }));
      } finally {
        setLoader(false);
      }
    };


    return (
      <TableRow>
        <TableCell>
          <Stack direction="row" alignItems="center" gap={1}>
            <Avatar variant="rounded" src={deal?.bannerImage} />
            <Typography>
              {Utils.limitStringWithEllipsis(deal?.dealName, 20)}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{`${requestor?.firstName} ${requestor?.lastName}`}</TableCell>
        <TableCell>{moment(data?.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>
        <TableCell>${parseFloat(deal?.dealAmount?.toFixed(2))}</TableCell>
        <TableCell>
          <Stack direction="row" gap={1}>
            <Typography color="secondary.main" variant="h6" fontWeight="bold">
              {deal?.voltzRequired}
            </Typography>
            <Image src={Voltz} alt="logo" priority />
          </Stack>
        </TableCell>
        <TableCell>
          {loader ? (
            <CircularProgress size={30} />
          ) : data?.status === "pending" ? (
            <>
              <IconButton
                color="success"
                onClick={() =>
                  handleRequest({
                    id: data?.id,
                    voltz: deal?.voltzRequired,
                    status: "accepted",
                  })
                }
              >
                <DoneOutlinedIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() =>
                  handleRequest({ id: data?.id, status: "rejected" })
                }
              >
                <CloseOutlinedIcon />
              </IconButton>
            </>
          ) : (
            <Typography
              color={data?.status === "accepted" ? "#4CAF50" : "error"}
              sx={{ textTransform: "capitalize" }}
            >
              {data?.status}
            </Typography>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Grid container spacing={2} alignItems="center" mb={4}>
        <Grid item xs={11} md={4}>
          <Typography variant="h4" fontWeight="SemiBold">
            Deals Requests
          </Typography>
        </Grid>
        {/* <Grid item xs={1} md={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={getAllRequests}>
              <ReplayOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Grid> */}
        <Grid item xs={12} md={8}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="flex-end"
            alignItems={{ xs: "flex-end", sm: "center" }}
            gap={2}
          >
            {(filter.status !== "all" ||
              filter.from != null ||
              filter.to != null) && (
                <IconButton onClick={clearFilter}>
                  <Delete />
                </IconButton>
              )}
            <SelectBox
              label="Requests"
              fullWidth
              optionRenderKeys={{
                name: "name",
                value: "value",
              }}
              value={filter.status}
              name="status"
              items={requestFiltersOpt}
              onChange={handleFilter}
              styles={{ width: 1 }}
            />
            <DatePicker
              type="date"
              required
              name="from"
              label="From"
              value={moment(filter?.from)}
              onChange={handleFilter}
            />
            <DatePicker
              type="date"
              required
              name="to"
              value={moment(filter?.to)}
              onChange={handleFilter}
              minDate={moment(filter.from)}
              label="To"
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack alignItems="flex-end">
        <Button onClick={downloadDeal}>Download</Button>
      </Stack>

      <Stack sx={{ minHeight: "500px" }}>
        <UITable
          headings={[
            "Deal",
            "Requested By",
            "Requested At",
            "Deal Amount",
            "Voltz Required",
            "Status",
          ]}
          spanTd={6}
          isContent={deals?.details?.length}
          loading={loading}
          handlePageChange={handlePagination}
          handleRowsPerPageChange={handleRowsPerPageChange}
          itemsPerPage={itemsPerPage}
          count={deals?.totalItems}
          page={filter?.page}
        >
          {deals?.details?.map((deal, i) => (
            <RenderRow
              setDeals={setDeals}
              setOpen={setOpen}
              key={i}
              index={i}
              data={deal}
            />
          ))}
        </UITable>
      </Stack>
      <DialogBox open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default DealsRequests;

const Style = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};

let requestFiltersOpt = [
  { name: "All", value: "all" },
  { name: "Accepted", value: "accepted" },
  { name: "Pending", value: "pending" },
  { name: "Rejected", value: "rejected" },
];
