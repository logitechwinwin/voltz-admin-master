/* eslint-disable no-unused-vars */
import React from "react";

import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Card, Paper, Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";

const DashboardCard = ({
  downFall,
  title,
  value,
  formWhomDate,
  trendingRate,
  icon,
  loading,
}) => {
  return (
    <Paper
      sx={{
        borderRadius: "12px",
        p: "16px",
        py: 3,
        boxShadow: " 0px 4.65px 7.74px 0px rgba(0, 0, 0, 0.2)",
        height: 1,
      }}
      component={Stack}
      justifyContent="space-between"
      spacing={1}
    >
      <Typography
        variant="h6"
        fontFamily="Nunito Sans"
        color="text.hint"
        fontWeight="SemiBold"
      >
        {title}
      </Typography>
      {loading ? (
        <Skeleton
          variant="text"
          height={40}
          width={130}
          sx={{ alignSelf: "flex-end" }}
        />
      ) : (
        <Stack direction="row" alignSelf="flex-end" gap={1}>
          <Typography fontWeight="700" variant="h4" fontFamily="Nunito Sans">
            {value}
          </Typography>
          {icon && <Image src={icon} width={30} alt="" />}
          <Typography variant="h6" fontWeight="SemiBold" alignSelf="center">
            {title === "Availed by" && "Volunteers"}
          </Typography>
        </Stack>
      )}
      {/* <Stack direction={{ lg: "row", sm: "column", xs: "row" }} spacing={1}>
        <TrendingRateCounter downFall={downFall} trendingRate={trendingRate} />
        <Typography fontFamily="Nunito Sans" fontWeight="600">
          {formWhomDate}
        </Typography>
      </Stack> */}
    </Paper>
  );
};

export default DashboardCard;

const TrendingRateCounter = ({ downFall, trendingRate }) => {
  return (
    <Stack direction="row" spacing={1}>
      {downFall ? (
        <TrendingDownIcon color="error" />
      ) : (
        <TrendingUpIcon color="success" />
      )}
      <Typography
        color={downFall ? "error.main" : "success.main"}
        fontFamily="Nunito Sans"
      >
        {trendingRate}
      </Typography>
    </Stack>
  );
};
