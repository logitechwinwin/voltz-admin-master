/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";

import styled from "@emotion/styled";
import {
  Avatar,
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ChartsLegend,
  pieArcLabelClasses,
  PieChart,
  useDrawingArea,
} from "@mui/x-charts";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import {
  Ad,
  BeachClean,
  CheckCircleIcon,
  CleanEnergy,
  CleanWater,
  Climate,
  DecentWork,
  DeliNova,
  GenderEquality,
  GoodHealth,
  Industry,
  LifeBelow,
  LifeOnLand,
  Lightening,
  Logo,
  NoPoverty,
  PartnerShip,
  Peace,
  QualityEducation,
  Reduced,
  Responsible,
  Sustainable,
  ZeroHunger,
  VoltzIcon,
} from "@/assets";
import {
  BarChartVolunteer,
  DashboardTableCardLayout,
  ReactSlider,
  SdgCard,
  TableWrapper,
  VoltzsCounterDisplayChip,
  PieChartWithCenterLabel,
  EmptyDealsMessage,
  TopCampaignCard,
} from "@/component";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";
import Utils from "@/Utils";
import { useSearchParams } from "next/navigation";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const params = useSearchParams()
  const id = params.get('id')
  const name = params.get('name')
  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();

  const getCompanyDashboard = async () => {
    setLoading(true);
    try {
      let { data } = await ApiManager({
        method: "get",
        path: `company/dashboard/stats/${id || user.id}`,
      });
      setDashboardStats(data?.response?.details);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanyDashboard();
  }, []);

  const dataForDeals = dashboardStats?.totalDeals
    ? [
      { value: dashboardStats?.runningDeals, label: "Running Deals" },
      { value: dashboardStats?.upcomingDeals, label: "Upcoming Deals" },
      { value: dashboardStats?.expiredDeals, label: "Expired Deals" },
    ]
    : [];

  const totalVoltzReceived = dashboardStats?.dealsStats?.reduce(
    (total, deal) => total + deal.voltzReceived,
    0
  );

  const dataForDealsAvails = dashboardStats?.dealsStats?.length
    ? dashboardStats?.dealsStats?.map((deal) => {
      const percentage = (
        (deal.voltzReceived / totalVoltzReceived) *
        100
      ).toFixed(2);
      return {
        value: deal.voltzReceived, // This will be used for the pie chart
        label: deal.dealName, // Display the deal name on hover
      };
    })
    : [];

  return (
    <Stack gap={2}>
      {user?.id !== id && <Typography variant="h4" fontWeight={'SemiBold'} sx={{ mb: 2 }}>{name}</Typography>}
      <Grid container spacing={1}>
        <Grid item xs={12} md={12 / 3}>
          <CompanyStats
            icon={VoltzIcon}
            title="Voltz Earned"
            value={parseFloat(dashboardStats?.totalVoltzEarned?.toFixed(2))}
            loading={loading}
            isVoltz
          />
        </Grid>
        <Grid item xs={12} md={12 / 3}>
          <CompanyStats
            title="Revenue"
            value={`$${parseFloat(dashboardStats?.revenue?.toFixed(2))}`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={12 / 3}>
          <CompanyStats
            title="Total Products"
            value={dashboardStats?.totalProducts}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={12 / 3}>
          <Paper
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            elevation={1}
          >
            <Typography px={2} variant="h6" fontWeight="bold">
              Deals Statistics
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              {dashboardStats?.totalDeals == 0 ? (
                <EmptyDealsMessage />
              ) : (

                <PieChartWithCenterLabel
                  data={dataForDeals}
                  label={dashboardStats?.totalDeals}
                  centerLabel="Total Deals"
                />
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12 / 3}>
          <Paper
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            elevation={1}
          >
            <Typography px={2} variant="h6" fontWeight="bold">
              Most Selling Deal
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              {!dashboardStats?.highestDeal ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    No Deals!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    It seems there is no deal at the moment.
                  </Typography>
                </Box>
              ) : (
                <TopCampaignCard
                  deal={dashboardStats?.highestDeal}
                  loading={loading}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12 / 3}>
          <Paper
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            elevation={1}
          >
            <Typography px={2} variant="h6" fontWeight="bold">
              Voltz Statistics
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              {dashboardStats?.dealsStats &&
                dashboardStats?.dealsStats.length > 0 ? (
                <PieChartWithCenterLabel
                  data={dataForDealsAvails}
                  label={totalVoltzReceived}
                  centerLabel="Total Voltz Earned"
                />
              ) : (
                <EmptyDealsMessage />
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} order={{ md: 3, xl: 2 }}>
          <Paper sx={{ p: 1, height: "100%" }}>
            <Typography px={2} variant="h6" fontWeight="bold">
              Monthly Overview
            </Typography>
            <BarChartVolunteer stats={dashboardStats?.monthlyEarnings} />
          </Paper>
        </Grid>
      </Grid>

    </Stack>
  );
};

export default Dashboard;

const tableOne = [
  "Products",
  "Duration",
  "Voltz Earned",
  "Discount",
  "Completion",
  "Promote",
];
const table2 = ["Products", "Voltz Earned", "Completion"];

// const TopCampaignCard = ({ deal }) => {
//   return (
//     <Paper sx={{ p: 1, height: "100%" }} component={Stack}>
//       <Typography px={2} variant="h6" fontWeight="bold">
//         Most Selling Deal
//       </Typography>
//       <Paper sx={{ mx: "auto", p: 1 / 3 }} component={Stack} my="auto" gap={1}>
//         <Stack direction="row" width={1} gap={1} px={1}>
//           <Avatar src={DeliNova.src} sx={{ height: 46, width: 46 }} />
//           <Stack>
//             <Typography
//               whiteSpace="nowrap"
//               variant="body1"
//               fontWeight="SemiBold"
//             >
//               {Utils.limitStringWithEllipsis(deal?.dealName, 20)}
//             </Typography>
//             <Typography variant="h5" fontWeight="bold">
//               {deal?.discountAmount}
//               {deal?.discountType === "percentage" ? "%" : ""} off
//             </Typography>
//           </Stack>
//         </Stack>
//         {deal?.bannerImage ? (
//           <Box
//             sx={{
//               maxHeight: 200,
//               position: "relative",
//               width: "100%",
//               height: "100px",
//             }}
//           >
//             <Image src={deal?.bannerImage} alt="" fill />
//           </Box>
//         ) : (
//           <Image src={Ad} alt="" />
//         )}
//         <Stack
//           direction="row"
//           justifyContent="center"
//           gap={2 / 3}
//           alignItems="center"
//         >
//           <Typography variant="h5" fontWeight="bold" color="secondary">
//             {deal?.voltzReceived}
//           </Typography>

//           <Image
//             src={Logo}
//             style={{
//               width: "30px",
//               height: "30px",
//             }}
//             alt=""
//           />
//         </Stack>
//       </Paper>
//     </Paper>
//   );
// };

const CompanyStats = ({ title, value, sx, loading, icon, isVoltz }) => {
  return (
    <Paper elevation={1} sx={{ px: 2, py: 3, ...sx }}>
      <Stack gap={2}>
        {loading ? (
          <Skeleton variant="text" width={100} height={20} />
        ) : (
          <Typography variant="body1" fontWeight="SemiBold">
            {title}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" width={50} height={30} />
        ) : (
          <Stack direction="row" alignSelf="flex-end">
            <Typography
              alignSelf="flex-end"
              fontWeight="SemiBold"
              variant="h4"
              marginRight={1}
            >
              {value || 0}
            </Typography>
            {isVoltz && icon && (
              <Image src={icon} alt="Logo" width={24} height={24} />
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
