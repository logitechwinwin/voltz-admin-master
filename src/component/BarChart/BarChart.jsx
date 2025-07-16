/* eslint-disable no-unused-vars */
"use client";

import React from "react";

import { Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const BarChartVolunteer = ({ stats }) => {
  const tickLabelProps = {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.87)", // or any other color you prefer
  };

  let dataForGraph = stats?.map((e) => e?.totalEarnings);

  return (
    <BarChart
      series={[
        {
          data: dataForGraph || [],
          stack: "A",
          label: "Total Earnings",
          color: "#06B0BA",
        },
      ]}
      leftAxis={null}
      height={330}
      bottomAxis={{
        disableLine: true,
        disableTicks: true,
        tickLabelStyle: {
          textAnchor: "middle",
          fontSize: 15,
          fill: "#929292",
          fontWeight: "bold",
        },
      }}
      xAxis={[
        {
          scaleType: "band",
          data: stats?.map((e) => e?.month) || [],
          barGapRatio: 1.5,
          categoryGapRatio: 0.8,
        },
      ]}
      borderRadius={264}
      slotProps={{ legend: { hidden: true } }}
      loading={false}
    />
  );
};

export default BarChartVolunteer;
