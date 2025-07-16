import { Box, Skeleton } from "@mui/material";

const SunburstChartSkeleton = () => {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        p: 3,
        height: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer ring */}
        <Skeleton
          variant="circular"
          width={200}
          height={200}
          sx={{ position: "absolute", bgcolor: "#e0e0e0" }}
        />
        {/* Middle ring */}
        <Skeleton
          variant="circular"
          width={150}
          height={150}
          sx={{ position: "absolute", bgcolor: "#d0d0d0" }}
        />
        {/* Inner ring */}
        <Skeleton
          variant="circular"
          width={100}
          height={100}
          sx={{ position: "absolute", bgcolor: "#c0c0c0" }}
        />
      </Box>
    </Box>
  );
};

export default SunburstChartSkeleton;
