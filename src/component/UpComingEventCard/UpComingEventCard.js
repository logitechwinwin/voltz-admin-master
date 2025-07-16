import React from "react";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { UpComingEventDummyImage, Donate } from "@/assets";
import Utils from "@/Utils";

const UpComingEventCard = ({ cardData, loading = false }) => {
  const router = useRouter();

  const changeNumber = (num) => {
    if (num >= 1000) {
      const formatedNum = (num / 1000).toFixed(1);
      return formatedNum.endsWith(".0")
        ? `${parseInt(formatedNum)}K`
        : `${formatedNum}K`;
    } else {
      return num?.toString();
    }
  };

  const calculatePercentage = () => {
    if (
      cardData?.donationRequired &&
      cardData?.donationReceived !== undefined
    ) {
      return (
        (Number(cardData?.donationReceived) /
          Number(cardData?.donationRequired)) *
        100
      );
    }
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: "23.78px", height: 1 }}>
        <Stack justifyContent="space-between" height={1}>
          <CardMedia sx={{ height: 200 }}>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </CardMedia>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" height={40} width="80%" />
              <Skeleton variant="text" height={30} width="60%" />
              <Skeleton variant="text" height={30} width="60%" />
              <Skeleton variant="rectangular" width="100%" height={10} />
            </Stack>
          </CardContent>
          <CardActions>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width="100%"
              height={40}
            />
          </CardActions>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      sx={{ borderRadius: "23.78px", height: 1 }}
      onClick={() => router.push(`/ngo/events/${cardData?.id}`)}
    >
      <Stack justifyContent="space-between" height={1}>
        <CardMedia sx={{ height: 200 }}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={cardData?.bannerImage}
              layout="fill"
              objectFit="cover"
              alt="Event"
            />
          </div>
        </CardMedia>
        <CardContent>
          <Stack spacing={1}>
            <Typography gutterBottom variant="h5" fontWeight="700">
              {Utils.limitStringWithEllipsis(cardData?.title, 20)}
            </Typography>
            <Stack direction="row" spacing={1}>
              <CalendarTodayOutlinedIcon fontSize="small" color="action" />
              <Typography component="div" color="text.secondary">
                {moment(cardData?.startDate).format("MMMM D, YYYY h:mm A")}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <LocationOnOutlinedIcon fontSize="small" color="action" />
              <Typography component="div" color="text.secondary">
                {`${cardData?.city}, ${cardData?.state}`}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <Stack sx={{ px: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <RenderDonors
              loading={loading}
              donations={cardData?.donations || []}
            />
            <Stack direction="row" alignItems="center">
              <Image src={Donate} alt="" />
              <Typography
                color="text.hint"
                sx={{ fontSize: "12px", whiteSpace: "nowrap" }}
              >
                {changeNumber(cardData?.donationReceived)} Donated
              </Typography>
            </Stack>
          </Stack>
          <Box
            sx={{
              "& .MuiLinearProgress-root": {
                backgroundColor: "#DADADA",
              },
            }}
          >
            <LinearProgress
              sx={{
                borderRadius: "2px",
                mt: 1,
              }}
              color="secondary"
              variant="determinate"
              value={calculatePercentage()}
            />
          </Box>
        </Stack>
        <CardActions>
          <PrimaryButton
            LinkComponent={Link}
            href={`/ngo/update-event/${cardData?.id}`}
            onClick={(e) => {
              e.stopPropagation(); // Stop the Card's onClick from firing
            }}
          >
            Edit Event
          </PrimaryButton>
        </CardActions>
      </Stack>
    </Card>
  );
};

export default UpComingEventCard;

const RenderDonors = ({ loading, donations }) => {
  const renderUsers = () => {
    if (!donations?.length) {
      return "No donations yet";
    }

    const fUserName = donations[0]?.user?.firstName;

    if (donations?.length === 1) {
      return ` Only ${fUserName} donated`;
    }

    if (donations?.length === 2) {
      return ` ${fUserName} and one more donated`;
    }

    return ` ${fUserName} and ${donations?.length - 1} others donated`;
  };

  return (
    <Stack direction="row" alignItems="center">
      {donations?.map((item, i) => {
        return loading ? (
          <Skeleton
            variant="rectangular"
            sx={{ width: "17px", height: "17px", borderRadius: "9px" }}
            key={i}
          />
        ) : (
          <Avatar
            key={i}
            src={item?.user?.profileImage}
            sx={{
              width: "17px",
              height: "17px",
              border: "1.5px solid #fff",
              borderRadius: "50%",
              marginLeft: "-7px",
            }}
          />
        );
      })}
      {loading ? (
        <Skeleton variant="text" width="100px" />
      ) : (
        <Typography
          color="text.hint"
          sx={{
            fontSize: "12px",
            display: "block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            // textOverflow: "ellipsis",
            // width: { lg: "100%", md: "80%", sm: "50%", xs: "50%" },
          }}
        >
          {Utils.limitStringWithEllipsis(renderUsers(), 25)}
        </Typography>
      )}
    </Stack>
  );
};
