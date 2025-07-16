import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Skeleton, Stack, Typography } from "@mui/material";

const BarChartSkeleton = () => {
  return (
    <Stack direction="column" spacing={2} alignItems="center" mt={5}>
      {/* Bar skeletons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          px: 3,
        }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="4%"
            height={250}
            sx={{ mx: 0.5 }}
          />
        ))}
      </Box>
    </Stack>
  );
};

const AdminBarChart = ({ data, months, loading }) => {
  if (loading) return <BarChartSkeleton />;

  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: months,
          tickPadding: 10,
        },
      ]}
      series={[
        {
          data: data.map((item) => item.voltzSold),
          label: "Voltz Sold",
          color: "#64b5f6",
        },
        {
          data: data.map((item) => item.voltzReachedToCompany),
          label: "Voltz Used",
          color: "#81c784",
        },
      ]}
      skipAnimation
      height={300}
      margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
      tooltip
    />
  );
};

export default AdminBarChart;
