"use client";

import {
  Box,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  AdminDashboardCard,
  SunburstChart,
  charityData,
  campaignData,
  AdminBarChart,
  SunburstChartSkeleton,
} from "@/component";
import { ApiManager } from "@/helpers";
import { useState, useEffect } from "react";
import {
  VolunteerActivismIcon,
  BusinessIcon,
  GroupsIcon,
  LocalOfferIcon,
} from "@/assets";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState("");
  const [revenueStats, setRevenueStats] = useState([]);
  const [charityStats, setCharityStats] = useState(null);
  const [campaignStats, setCampaignStats] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [loading, setLoading] = useState(false);

  const years = [2020, 2021, 2022, 2023, 2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getAdminDashboard = async () => {
    setLoading(true);
    try {
      let { data } = await ApiManager({
        method: "get",
        path: "admin/dashboard-stats",
      });
      const charityCounts = data?.response?.details?.charityCounts;
      setCharityStats(charityData(charityCounts));
      const campaignCounts = data?.response?.details?.campaignCounts;
      setCampaignStats(campaignData(campaignCounts));

      setDashboardStats(data?.response?.details);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getRevenueStats = async (year) => {
    try {
      let { data } = await ApiManager({
        method: "get",
        path: `admin/revenue-stats/${year}`,
      });
      setRevenueStats(data?.response?.details);
    } catch (error) {
      console.log(error);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    getRevenueStats(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    getAdminDashboard();
  }, []);

  // const chartData = revenueStats
  //   ? revenueStats.map((item, index) => ({
  //       month: monthNames[index],
  //       voltzSold: Number(item.voltzSold),
  //       voltzReachedToCompany: Number(item.voltzReachedToCompany),
  //     }))
  //   : [];

  return (
    <Box p={3}>
      <Grid container spacing={2}>
        {/* Dashboard Stats */}
        {loading ? (
          Array(4)
            .fill()
            .map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <AdminDashboardCard loading={true} />
              </Grid>
            ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AdminDashboardCard
                title="NGO"
                icon={<GroupsIcon sx={{ fontSize: 30, color: "#707070" }} />}
                value={dashboardStats?.ngoCounts?.total}
                statuses={{
                  pending: dashboardStats?.ngoCounts?.pending,
                  active: dashboardStats?.ngoCounts?.approvedAndActive,
                  inactive: dashboardStats?.ngoCounts?.approvedAndInActive,
                  rejected: dashboardStats?.ngoCounts?.rejected,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AdminDashboardCard
                title="Company"
                icon={<BusinessIcon sx={{ fontSize: 30, color: "#707070" }} />}
                value={dashboardStats?.companyCounts?.total}
                statuses={{
                  pending: dashboardStats?.companyCounts?.pending,
                  active: dashboardStats?.companyCounts?.approvedAndActive,
                  inactive: dashboardStats?.companyCounts?.approvedAndInActive,
                  rejected: dashboardStats?.companyCounts?.rejected,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AdminDashboardCard
                title="Volunteer"
                icon={
                  <VolunteerActivismIcon
                    sx={{ fontSize: 30, color: "#707070" }}
                  />
                }
                value={dashboardStats?.volunteerCounts?.total}
                statuses={{
                  active: dashboardStats?.volunteerCounts?.active,
                  inactive: dashboardStats?.volunteerCounts?.inActive,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AdminDashboardCard
                title="Deal"
                icon={
                  <LocalOfferIcon sx={{ fontSize: 30, color: "#707070" }} />
                }
                value={dashboardStats?.dealsCounts?.totalDeals}
                statuses={{
                  running: dashboardStats?.dealsCounts?.runningDeals,
                  upcoming: dashboardStats?.dealsCounts?.upcomingDeals,
                  expired: dashboardStats?.dealsCounts?.expiredDeals,
                }}
              />
            </Grid>
          </>
        )}

        {/* Bar    */}
        <Grid item xs={12} sm={12} md={12}>
          <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              boxShadow: "0px 4.65px 7.74px rgba(0, 0, 0, 0.2)",
              height: 1,
            }}
          >
            <Stack
              gap={2}
              direction="row"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h5"
                color="text.secondary"
                fontWeight="bold"
                gutterBottom
              >
                Voltz Sales & Usage
              </Typography>
              <FormControl sx={{ width: 150 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={handleYearChange}
                  label="Year"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <AdminBarChart
              data={revenueStats}
              months={monthNames}
              loading={loading}
            />
          </Paper>
        </Grid>

        {/* Sunburst Charts */}
        <Grid item xs={12} sm={6} md={6}>
          <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              boxShadow: "0px 4.65px 7.74px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              fontWeight="bold"
              gutterBottom
            >
              Charities Stats
            </Typography>
            {loading ? (
              <SunburstChartSkeleton />
            ) : (
              <SunburstChart data={charityStats} title="Charities" />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              boxShadow: "0px 4.65px 7.74px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              fontWeight="bold"
              gutterBottom
            >
              Campaigns Stats
            </Typography>
            {loading ? (
              <SunburstChartSkeleton />
            ) : (
              <SunburstChart data={campaignStats} title="Campaigns" />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
