/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useDispatch } from "react-redux";

import { DownloadIcon, Mcdonald, Voltz, VoltzYellow } from "@/assets";
import {
  CenteredTabs,
  DashboardCard,
  DashboardTableCardLayout,
  TableWrapper,
} from "@/component";
import VoltzsCounterDisplayChip from "@/component/VoltzsCounterDisplayChip/VoltzsCounterDisplayChip";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";
import Utils from "@/Utils";
import UITable from "@/component/TableContainer/TableContainer";

const Dashboard = () => {
  const [loading, setLoading] = useState({
    table: false,
    stats: false,
  });
  const [tabValue, setTabValue] = useState(3);
  const [reportStats, setReportStats] = useState(null);
  const [reportTable, setReportTable] = useState(null);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const dispatch = useDispatch();

  const dateFilter = {
    0: {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    },
    1: {
      startDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    },
    2: {
      startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    },
    3: {
      startDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    },
  };

  const getReportStats = async () => {
    try {
      setLoading((p) => ({ ...p, stats: true }));
      let { data } = await ApiManager({
        method: "get",
        path: `deal/analytics?startDate=${dateFilter[tabValue]?.startDate}&endDate=${dateFilter[tabValue]?.endDate}`,
      });
      setReportStats(data?.response?.details);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading((p) => ({ ...p, stats: false }));
    }
  };


  const getReportData = async () => {
    try {
      setLoading((p) => ({ ...p, table: true }));
      let { data } = await ApiManager({
        method: "get",
        path: `deal/reports?page=${page + 1}&perPage=${itemsPerPage}&startDate=${dateFilter[tabValue]?.startDate}&endDate=${dateFilter[tabValue]?.endDate}`,
      });
      setReportTable(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading((p) => ({ ...p, table: false }));
    }
  };

  useEffect(() => {
    getReportStats();
  }, [tabValue]);

  useEffect(() => {
    getReportData();
  }, [page, tabValue]);

  const handleTabChange = (v) => {
    setTabValue(v);
  };

  const handlePageChange = (_, v) => {
    setPage(v);
  };
  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const downloadReport = async () => {
    try {
      const response = await ApiManager({
        method: "get",
        path: `deal/reports/download/?startDate=${dateFilter[tabValue]?.startDate}&endDate=${dateFilter[tabValue]?.endDate}`,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "report.csv"; // Set the file name for the download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const renderRow = (item) => {
    return (
      <TableRow key={item?.id}>
        <TableCell>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            gap={2}
          >
            <Avatar src={item?.bannerImage} variant="rounded" />
            <Stack>
              <Typography textAlign="left" fontWeight="SemiBold">
                {item?.dealName}
              </Typography>
              <Typography color="text.hint">
                {Utils.limitStringWithEllipsis(item?.about, 20)}
              </Typography>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell>{item?.volunteerParticipated}</TableCell>
        <TableCell sx={{ position: "relative" }}>
          <VoltzsCounterDisplayChip
            value={parseFloat(Number(item?.totalVoltzEarned).toFixed(2))}
          />
        </TableCell>
        <TableCell sx={{ position: "relative" }}>
          ${parseFloat(Number(item?.totalAmountEarned).toFixed(2))}
        </TableCell>
        <TableCell>{moment(item?.from).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>
        <TableCell>{moment(item?.to).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>
        {/* <TableCell>
          <Button color="secondary">View</Button>
        </TableCell> */}
      </TableRow>
    );
  };

  return (
    <Container maxWidth="lg" sx={Style.table}>
      {/* ----------------------------- START -----------------------------*/}

      {/* ----------------------------- STATUS CARDS -----------------------------*/}
      <Stack gap={1} mb={"50px"} justifyContent="space-between">
        <Typography variant="h3" mb={"30px"} fontWeight="SemiBold">
          Reports
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          width={1}
          gap={2}
          justifyContent="center"
          sx={{ position: "relative" }}
        >
          <Box sx={{ width: { xs: "100%", sm: "60%", md: "50%" } }}>
            <CenteredTabs value={tabValue} handleChange={handleTabChange} />
          </Box>

          <Button
            sx={{
              position: { xs: "relative", sm: "absolute" },
              alignSelf: "flex-end",
              right: 0,
              bottom: 0,
              color: "button.dark",
            }}
            startIcon={<DownloadIcon />}
            onClick={downloadReport}
          >
            Download
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={4}>
        <Grid item md={4} xs={12}>
          <DashboardCard
            loading={loading?.stats}
            title="Spent by Volunteers"
            icon={Voltz}
            value={
              parseFloat(reportStats?.voltzSpentByVolunteer.toFixed(2)) || 0
            }
            trendingRate="8.5%"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <DashboardCard
            loading={loading?.stats}
            title="Availed by"
            value={reportStats?.acceptedRequests || 0}
            trendingRate="8.5%"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <DashboardCard
            loading={loading?.stats}
            title="Revenue"
            value={
              "$" + parseFloat(Number(reportStats?.revenue).toFixed(2) || 0)
            }
            trendingRate="8.5%"
          //  downFall icon={VoltzYellow}
          />
        </Grid>
      </Grid>

      {/* ----------------------------- STATUS CARDS -----------------------------*/}

      {/* ----------------------------- TABLE CARDS -----------------------------*/}

      <Grid container mt={"30px"} spacing={2}>
        <Grid item xs={12}>
          <DashboardTableCardLayout title="Deals Statistics ">
            <Stack sx={{ minHeight: "500px" }}>
              <UITable
                headings={tableOne}
                spanTd={tableOne?.length}
                isContent={reportTable?.details?.length}
                loading={loading?.table}
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                itemsPerPage={itemsPerPage}
                count={reportTable?.totalItems}
                page={page}
              >
                {reportTable?.details?.map((e) => renderRow(e))}
              </UITable>
            </Stack>
          </DashboardTableCardLayout>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

const tableOne = [
  "Deal Name",
  "Volunteers",
  "Voltz Earned",
  "Amount Earned",
  "Start Date",
  "End Date",
];
const Style = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
