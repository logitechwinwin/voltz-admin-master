import * as React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { PieChart } from "@mui/x-charts/PieChart";

const pieParams = { height: 350, margin: { right: 5 } };

export default function PieChartWithCenterLabel({ data, label, centerLabel }) {
  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
  }));

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    return (
      <>
        <StyledText
          x={centerX}
          y={centerY - 30}
          fontSize={20}
          sx={{ fill: "#888888" }}
        >
          {centerLabel}
        </StyledText>
        <StyledText x={centerX} y={centerY + 20} fontSize={50} fontWeight={700}>
          {children}
        </StyledText>
      </>
    );
  }

  // Check if all deals are zero (but totalDeals > 0)
  const allDealsAreZero = data.every((deal) => deal.value === 0) && label > 0;
  const dealColors = [
    "red",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#36A2EB",
    "#9966FF",
    "#FF6384",
    "#4BC0C0",
    "#FF9F40",
  ];

  return (
    <Stack direction="row" width="100%" textAlign="center" spacing={2}>
      <Box flexGrow={1}>
        <PieChart
          colors={
            allDealsAreZero ? ["#D3D3D3"] : dealColors.slice(0, data.length)
          }
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          series={[
            {
              data: allDealsAreZero
                ? [{ value: 1 }] // Single slice for empty state
                : data, // Use actual data when not empty
              paddingAngle: 0,
              innerRadius: 115,
              outerRadius: 140,
            },
          ]}
          {...pieParams}
        >
          <PieCenterLabel>{label}</PieCenterLabel>
        </PieChart>
      </Box>
    </Stack>
  );
}
