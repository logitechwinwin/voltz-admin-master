/* eslint-disable no-unused-vars */
"use client";

import { Box, Grid, Paper, Stack, TableCell, TableRow, Typography } from "@mui/material";

import { DashboardCard, DashboardTableCardLayout, LineAnimation, SelectBox, SimpleLineChart, StackedAreaChart, TableWrapper, UpComingEventCard } from "@/component";
import VoltzsCounterDisplayChip from "@/component/VoltzsCounterDisplayChip/VoltzsCounterDisplayChip";

const Advertisement = () => {
  return (
    <Paper sx={{p:2}}>
       <Stack gap={3}>

        <Stack direction='row' justifyContent='space-between' alignItems='center' pt={5} pb={3}>
      <Typography variant="h4" fontWeight='bold'>Advertisement Metrics</Typography>
      <SelectBox label="Filter by Ad"/>
        </Stack>
  
      {/* ----------------------------- START -----------------------------*/}

      {/* ----------------------------- STATUS CARDS -----------------------------*/}

      <Grid container spacing={2}>
        <Grid item  lg={12 / 6} sm={12 / 3} xs={12}>
          <DashboardCard title="Impressions" value="10"  trendingRate="8.5%" />
        </Grid>
        <Grid item lg={12 / 6} sm={12 / 3} xs={12}>
          <DashboardCard title="Clicks" value="5"  trendingRate="8.5%" />
        </Grid>
        <Grid item lg={12 / 6} sm={12 / 3} xs={12}>
          <DashboardCard title="CTR" value="100"  trendingRate="8.5%" downFall />
        </Grid>
        <Grid item lg={12 / 6} sm={12 / 3} xs={12}>
          <DashboardCard title="Conversion" value="10"  trendingRate="8.5%" />
        </Grid>
        <Grid item lg={12 / 6} sm={12 / 3} xs={12}>
          <DashboardCard title="CPC" value="10"  trendingRate="8.5%" />
        </Grid>
        <Grid item lg={12 / 6} sm={12 / 3} xs={12}>
          <DashboardCard title="ROI" value="10"  trendingRate="8.5%" />
        </Grid>
      </Grid>

      {/* ----------------------------- STATUS CARDS -----------------------------*/}

      {/* ----------------------------- TABLE CARDS -----------------------------*/}
      <Paper sx={{p:2}}>
        <Typography variant="h5" fontWeight='bold'>Total Visits</Typography>
        <StackedAreaChart />
      </Paper>
      <Grid container mt={"30px"} spacing={2}>
        <Grid item md={6} xs={12}>
          <DashboardTableCardLayout>
            <TableWrapper thContent={tableOne} spanTd={tableOne.length} isContent>
              {Array(3)
                .fill("_")
                .map((_, i) => (
                    <TableRow key={i}>
                    <TableCell>Ocean Cleanup</TableCell>
                    <TableCell>1k</TableCell>
                    <TableCell>$500</TableCell>
                    <TableCell sx={{ position: "relative" }}>
                      <VoltzsCounterDisplayChip value="50" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableWrapper>
          </DashboardTableCardLayout>
        </Grid>
        <Grid item md={6} xs={12}>
          <DashboardTableCardLayout>
            <TableWrapper thContent={table2} spanTd={table2.length} isContent>
              {Array(3)
                .fill("_")
                .map((_, i) => (
                    <TableRow key={i}>
                    <TableCell>Ocean Cleanup</TableCell>
                    <TableCell>1k</TableCell>
                    <TableCell>$500</TableCell>
                  </TableRow>
                ))}
            </TableWrapper>
          </DashboardTableCardLayout>
        </Grid>
      </Grid>

      {/* ----------------------------- TABLE CARDS -----------------------------*/}

      {/* ----------------------------- UPCOMING EVENTS -----------------------------*/}
     
      {/* ----------------------------- UPCOMING EVENTS -----------------------------*/}

      </Stack>

                </Paper>
  );
};

export default Advertisement;

const tableOne = ["Event", "Volunteers", "Charity Raised", "Voltz earned"];
const table2 = ["Event", "Volunteers", "Charity Raised"];
