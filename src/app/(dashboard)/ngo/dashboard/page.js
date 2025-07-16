"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Grid,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { VoltzIcon } from "@/assets";
import {
  DashboardCard,
  DashboardTableCardLayout,
  TableWrapper,
  UpComingEventCard,
  VoltzsCounterDisplayChip,
} from "@/component";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";
import { useSearchParams } from "next/navigation";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(null);

  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();
  const params = useSearchParams()
  const id = params?.get('id')
  const name = params?.get('name')
  const getDashboardAndEventsData = async () => {
    setLoading(true);
    try {
      let dashboardResponse = ApiManager({
        method: "get",
        path: `ngo/dashboard/stats/${id || user.id}`,
      });
      let upcomingEventsResponse = ApiManager({
        method: "get",
        path: `events?type=campaign&page=1&ngoId=${id || user?.id}&perPage=4&upcomingOnly=true`,
      });

      let [dashboardData, eventsData] = await Promise.all([
        dashboardResponse,
        upcomingEventsResponse,
      ]);

      setDashboardStats(dashboardData?.data?.response?.details);
      setUpcomingEvents(eventsData?.data?.response?.details?.items);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardAndEventsData();
  }, []);

  return (
    <Box>
      {/* ----------------------------- START -----------------------------*/}

      {/* ----------------------------- STATUS CARDS -----------------------------*/}
      {user?.id !== id && <Typography variant="h4" fontWeight={'SemiBold'} sx={{ mb: 5 }}>{name}</Typography>}
      <Grid container spacing={2}>
        <Grid item md={12 / 5} sm={12 / 3} xs={12}>
          <DashboardCard
            loading={loading}
            title="Total Events"
            value={dashboardStats?.totalEvents || 0}
            formWhomDate="from last month"
            trendingRate="8.5%"
          />
        </Grid>
        <Grid item md={12 / 5} sm={12 / 3} xs={12}>
          <DashboardCard
            loading={loading}
            title="Upcoming Events"
            value={dashboardStats?.upcomingEvents || 0}
            formWhomDate="from last month"
            trendingRate="8.5%"
          />
        </Grid>
        <Grid item md={12 / 5} sm={12 / 3} xs={12}>
          <DashboardCard
            loading={loading}
            title="Total Volunteers"
            value={Number(dashboardStats?.totalVolunteerRequests) || 0}
            formWhomDate="from last month"
            trendingRate="8.5%"
            downFall
          />
        </Grid>
        <Grid item md={12 / 5} sm={12 / 3} xs={12}>
          <DashboardCard
            loading={loading}
            title="Charity Raised"
            value={
              "$" +
              (parseFloat(dashboardStats?.totalDonationRaised?.toFixed(2)) || 0)
            }
            formWhomDate="from last month"
            trendingRate="8.5%"
          />
        </Grid>
        <Grid item md={12 / 5} sm={12 / 3} xs={12}>
          <DashboardCard
            loading={loading}
            title="Voltz Given"
            icon={VoltzIcon}
            value={parseFloat(dashboardStats?.totalGiven?.toFixed(2)) || 0}
            formWhomDate="from last month"
            trendingRate="8.5%"
          />
        </Grid>
      </Grid>

      {/* ----------------------------- STATUS CARDS -----------------------------*/}

      {/* ----------------------------- TABLE CARDS -----------------------------*/}

      <Grid container mt={"30px"} spacing={2}>
        <Grid item md={6} xs={12}>
          <DashboardTableCardLayout title="Top Campaigns this month">
            <TableWrapper
              thContent={tableOne}
              spanTd={tableOne.length}
              isLoading={loading}
              isContent={dashboardStats?.top3Campaigns?.length}
            >
              {dashboardStats?.top3Campaigns?.map((compaign, i) => (
                <TableRow key={i}>
                  <TableCell>{compaign?.title}</TableCell>
                  <TableCell>
                    {Number(compaign?.volunteerParticipated)}
                  </TableCell>
                  <TableCell>
                    ${parseFloat(compaign?.charityRaised?.toFixed(2))}
                  </TableCell>
                  <TableCell sx={{ position: "relative" }}>
                    <VoltzsCounterDisplayChip
                      value={compaign?.voltzUsed || 0.0}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableWrapper>
          </DashboardTableCardLayout>
        </Grid>
        <Grid item md={6} xs={12}>
          <DashboardTableCardLayout title="Top Charities this month">
            <TableWrapper
              thContent={table2}
              spanTd={table2.length}
              isLoading={loading}
              isContent={dashboardStats?.top3Charities?.length}
            >
              {dashboardStats?.top3Charities?.map((charity, i) => (
                <TableRow key={i}>
                  <TableCell>{charity?.title}</TableCell>
                  <TableCell>{Number(charity?.donationCount)}</TableCell>
                  <TableCell>
                    ${Number(parseFloat(charity?.charityRaised)?.toFixed(2))}
                  </TableCell>
                </TableRow>
              ))}
            </TableWrapper>
          </DashboardTableCardLayout>
        </Grid>
      </Grid>

      {/* ----------------------------- TABLE CARDS -----------------------------*/}

      {/* ----------------------------- UPCOMING EVENTS -----------------------------*/}
      <Stack
        direction="row"
        mt={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6">
          <strong> Upcoming</strong> Event
        </Typography>
        {upcomingEvents?.length > 4 && <Button LinkComponent={Link} href="/ngo/upcoming-events">
          View All
        </Button>}
      </Stack>
      <Grid container mt={"20px"} spacing={2}>
        {loading ? (
          Array(4)
            .fill()
            .map((_, i) => (
              <Grid item sm={6} xs={12} md={4} lg={3} key={i}>
                <UpComingEventCard loading />
              </Grid>
            ))
        ) : (
          <EventsGrid events={upcomingEvents} />
        )}
      </Grid>

      {/* ----------------------------- UPCOMING EVENTS -----------------------------*/}
    </Box>
  );
};

export default Dashboard;

const tableOne = ["Event", "Volunteers", "Charity Raised", "Voltz Spent"];
const table2 = ["Event", "Volunteers", "Charity Raised"];

const EventsGrid = ({ events }) => {
  return (
    <>
      {events ? (
        events?.slice(0, 4).map((e) => (
          <Grid item sm={6} xs={12} md={4} lg={3} key={e.id}>
            <UpComingEventCard cardData={e} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12} marginTop={20} paddingY={20}>
          <Typography variant="h6" align="center">
            No upcoming events available.
          </Typography>
        </Grid>
      )}
    </>
  );
};
