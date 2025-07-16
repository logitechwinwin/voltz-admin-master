/* eslint-disable no-unused-vars */
"use client";
import { useEffect, useState } from "react";

import { Delete, Download } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import { CloseOutlinedIcon, DoneOutlinedIcon, Voltz } from "@/assets";
import { AutoComplete, DatePicker, SelectBox, TableWrapper } from "@/component";
import DialogBox from "@/component/DialogBox/DialogBox";
import { ApiManager } from "@/helpers";
import useQueryParams from "@/hooks/useQueryParams";
import { setToast, setWalletBalance } from "@/store/reducer";
import Utils from "@/Utils";
import UITable from "@/component/TableContainer/TableContainer";
import Grid2 from "@mui/material/Unstable_Grid2";
import {
  tableHeadings,
  transactionHistoryStatus,
  transactionTypeData,
} from "./data";
import { ngoTableRow } from "./table-rows/ngoTableRow";
import { companyTableRow } from "./table-rows/companyTableRow";
import { volunteerTableRow } from "./table-rows/volunteerTableRow";

const TransactionHistory = ({ type }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const { queryParams, setQueryParams, clearQueryParams } = useQueryParams({
    from: null,
    till: null,
    status: "all",
    type: "all",
    dealId: null,
    userId: null,
    page: 0,
    eventId: null,
    perPage: 5,
    campaignManagerId: null,
  });
  const [filter, setFilter] = useState(queryParams);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.appReducer);
  const isAdmin = user?.role === "admin";

  let transactionType;
  if (type === "company-transaction") transactionType = "company";
  if (type === "volunteer-transaction") transactionType = "volunteer";
  if (type === "ngo-transaction") transactionType = "ngo";
  useEffect(() => {
    getAllRequests();
  }, [filter]);

  const getAllRequests = async () => {
    setLoading(true);
    let query = Utils.buildQueryString({
      ...filter,
      page: filter?.page + 1,
    });

    let path = `wallet-transaction?${query}&transactionsOf=${transactionType}`;
    if (!isAdmin) path += `&userId=${user?.id}`;
    try {
      let { data } = await ApiManager({ path });
      setRecords(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilter((prev) => ({
      ...prev,
      from: null,
      till: null,
      status: "all",
      dealId: null,
      userId: null,
      eventId: null,
      campaignManagerId: null,
      volunteerId: null,
    }));

    clearQueryParams();
  };

  const handleFilter = (e, v) => {
    let { name, value } = e.target;
    let dateInUtc;
    if (name === "from" || name === "till") {
      dateInUtc = moment(value).startOf("d").toISOString();
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
    }));
    setQueryParams("page", count);
  };

  const handleRowsPerPageChange = (e) => {
    setFilter((prev) => ({
      ...prev,
      page: 0,
      perPage: parseInt(e.target.value, 10),
    }));
  };

  const handleAutoCompleteChange = (e, value, name) => {
    setFilter((prev) => ({
      ...prev,
      ...(name === "userId"
        ? { dealId: null, eventId: null, campaignManagerId: null }
        : {}),
      [name]: value,
    }));
    setQueryParams(name, JSON.stringify(value));
  };

  const downloadTransaction = async () => {
    try {
      let query = Utils.buildQueryString({
        ...filter,
        page: filter?.page + 1,
      });
      let path = `wallet-transaction/download?&${query}&transactionsOf=${transactionType}`;
      // if (status !== "all") path += `&status=${status}`;
      // if (fromTo?.from !== "") path += `&from=${moment(fromTo?.from).toISOString()}`;
      // if (fromTo?.to !== "") path += `&till=${moment(fromTo?.to).toISOString()}`;
      if (user?.role !== "admin") path += `&userId=${user?.id}`;
      const response = await ApiManager({
        method: "get",
        path,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "wallet-transaction.csv"; // Set the file name for the download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Grid2 container spacing={1} alignItems="center" mb={1}>
        <Grid2 item xs={12} md={12}>
          <Stack
            alignItems="flex-end"
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h4" fontWeight="SemiBold">
              {user?.role === "admin"
                ? `${Utils.capitalize(transactionType)} Transaction`
                : "Transactions"}
            </Typography>
            <Stack alignItems="flex-end" direction="row" gap={2}>
              {(filter?.dealId != null ||
                filter?.status !== "all" ||
                filter?.from != null ||
                filter?.to != null ||
                filter?.userId != null ||
                filter?.eventId != null) && (
                <Button onClick={clearFilter} startIcon={<Delete />}>
                  Clear All
                </Button>
              )}
              <Button onClick={downloadTransaction} startIcon={<Download />}>
                Download
              </Button>
            </Stack>
          </Stack>
        </Grid2>
        {/* <Grid item xs={1} md={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={getAllRequests}>
              <ReplayOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Grid> */}

        <Grid2
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        ></Grid2>
        {transactionType === "company" && (
          <>
            {isAdmin && (
              <Grid2 item xs={12} sm={6} lg={4}>
                <AutoComplete
                  url={`company?page=1&perPage=10`}
                  onChange={(e, v) => handleAutoCompleteChange(e, v, "userId")}
                  value={filter?.userId}
                  label="Company"
                />
              </Grid2>
            )}
            <Grid2 item xs={12} sm={6} lg={4}>
              <AutoComplete
                url={`deal?page=1&perPage=10${!isAdmin ? `&userId=${user?.id}` : filter?.userId ? `&companyId=${filter?.userId?.id}` : ""}`}
                onChange={(e, v) => handleAutoCompleteChange(e, v, "dealId")}
                value={filter?.dealId}
                label="Deal"
              />
            </Grid2>
          </>
        )}
        {transactionType === "ngo" && (
          <>
            {isAdmin && (
              <Grid2 item xs={12} sm={6} lg={4}>
                <AutoComplete
                  url={`ngo?page=1&perPage=10`}
                  onChange={(e, v) => handleAutoCompleteChange(e, v, "userId")}
                  value={filter?.userId}
                  label="Ngo"
                />
              </Grid2>
            )}
            <Grid2 item xs={12} sm={6} lg={4}>
              <AutoComplete
                url={`events?page=1&perPage=10&${!isAdmin ? `&userId=${user?.id}` : filter?.userId ? `&ngoId=${filter?.userId?.id}` : ""}`}
                onChange={(e, v) => handleAutoCompleteChange(e, v, "eventId")}
                value={filter?.eventId}
                label="Event"
              />
            </Grid2>
            {filter?.userId && (
              <Grid2 item xs={12} sm={6} lg={4}>
                <AutoComplete
                  url={`campaignManager?page=1&perPage=10&ngoId=${filter?.userId?.id}`}
                  onChange={(e, v) =>
                    handleAutoCompleteChange(e, v, "campaignManagerId")
                  }
                  value={filter?.campaignManagerId}
                  label="Campaign Manager"
                />
              </Grid2>
            )}
          </>
        )}
        {transactionType === "volunteer" && (
          <>
            {isAdmin && (
              <Grid2 item xs={12} sm={6} lg={4}>
                <AutoComplete
                  url={`volunteer?page=1&perPage=10`}
                  onChange={(e, v) => handleAutoCompleteChange(e, v, "userId")}
                  value={filter?.userId}
                  label="Volunteer"
                />
              </Grid2>
            )}
            <Grid2 item xs={12} sm={6} lg={4}>
              <AutoComplete
                url={`events?page=1&perPage=10&`}
                onChange={(e, v) => handleAutoCompleteChange(e, v, "eventId")}
                value={filter?.eventId}
                label="Event"
              />
            </Grid2>
          </>
        )}
        {transactionType !== "ngo" && (
          <Grid2 item xs={12} sm={6} lg={4}>
            <SelectBox
              label="Status"
              fullWidth
              optionRenderKeys={{
                name: "name",
                value: "value",
              }}
              value={filter.status}
              name="status"
              items={transactionHistoryStatus}
              onChange={handleFilter}
              styles={{ width: 1 }}
            />
          </Grid2>
        )}
        {transactionType !== "volunteer" && (
          <>
            <Grid2 item xs={12} sm={6} lg={4}>
              <SelectBox
                label="Type"
                fullWidth
                optionRenderKeys={{
                  name: "name",
                  value: "value",
                }}
                value={filter.type}
                name="type"
                items={transactionTypeData[transactionType]}
                onChange={handleFilter}
                styles={{ width: 1 }}
              />
            </Grid2>
          </>
        )}
        <Grid2 item xs={12} sm={6} lg={4}>
          <DatePicker
            disableFuture
            type="date"
            required
            name="from"
            label="From"
            value={moment(filter?.from)}
            onChange={handleFilter}
          />
        </Grid2>
        <Grid2 item xs={12} sm={6} lg={4}>
          <DatePicker
            type="date"
            required
            disableFuture
            name="till"
            value={moment(filter?.till)}
            onChange={handleFilter}
            minDate={moment(filter.from)}
            label="To"
          />
        </Grid2>
        {/* </Stack> */}
      </Grid2>

      <UITable
        headings={tableHeadings(isAdmin, transactionType, filter?.type)}
        spanTd={tableHeadings(isAdmin, transactionType, filter?.type)?.length}
        minWidth={"1100px"}
        isContent={records?.details?.length}
        loading={loading}
        handlePageChange={handlePagination}
        handleRowsPerPageChange={handleRowsPerPageChange}
        itemsPerPage={filter?.perPage}
        count={records?.totalItems}
        page={filter?.page}
      >
        {records?.details?.map((item, i) => {
          if (transactionType === "ngo")
            return ngoTableRow({ data: item, role: user?.role });
          if (transactionType === "company")
            return companyTableRow({ data: item, role: user?.role });
          if (transactionType === "volunteer")
            return volunteerTableRow({ data: item, role: user?.role });
        })}
      </UITable>

      <DialogBox open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default TransactionHistory;

const Style = {
  table: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 118px)",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
