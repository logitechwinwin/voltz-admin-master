"use client";

import React, { useEffect, useState } from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import {
  SingleEventComment,
  SingleEventDonation,
  SingleEventsRegisteredVolunteers,
  SingleEventStats,
} from "@/component";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";
import BackButton from "../BackButton/BackButton";

const SingleEventDetail = ({ params }) => {
  const { user } = useSelector((state) => state.appReducer);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const dispatch = useDispatch();
  const eventId =
    user?.role === "campaign_manager" ? params?.campaignId : params?.eventId;

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const { data } = await ApiManager({
          method: "get",
          path: `events/${eventId}/stats`,
        });
        setEventData(data?.response?.details);
      } catch (error) {
        dispatch(setToast({ type: "error", message: error?.message }));
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  const {
    title,
    type,
    description,
    bannerImage,
    startDate,
    endDate,
    state,
    city,
    facebookUrl,
    linkedinUrl,
    twitterUrl,
    youtubeUrl,
    donationReceived,
    donationRequired,
    volunteerRequired,
    voltzPerHour,
  } = eventData?.event || {};

  let statsData = {
    campaign: [
      { label: "Total Registration", value: eventData?.totalRegistration },
      { label: "Total Participation", value: eventData?.totalParticipation },
      {
        label: "Voltz Spent",
        value: parseFloat(eventData?.voltzSpent?.toFixed(2)),
        showIcon: true,
      },
      {
        label: "Donation Received",
        value: parseFloat(donationReceived?.toFixed(2)),
      },
    ],
    charity: [
      { label: "Total Donation", value: eventData?.totalDonation },
      {
        label: "Donation Received",
        value: parseFloat(donationReceived?.toFixed(2)),
      },
      donationRequired && {
        label: "Donation Required",
        value: parseFloat(donationRequired?.toFixed(2)),
      },
    ],
  };

  const eventDetails = [
    {
      label: "Start Date",
      value: new Date(startDate).toLocaleString(),
      icon: <CalendarMonthIcon />,
    },
    {
      label: "End Date",
      value: endDate ? new Date(endDate).toLocaleString() : "-",
    },
    ...(type !== "charity"
      ? [{ label: "Volunteers Required", value: volunteerRequired || "-" }]
      : []),
    { label: "Voltz Per Hour", value: voltzPerHour },
    { label: "Event Address", value: `${state} ${city}` },
  ];

  const tabs = [
    <SingleEventStats
      loading={loading}
      stats={statsData[type]}
      type={type}
      key={1}
      details={eventDetails}
      linkedinUrl={linkedinUrl}
      facebookUrl={facebookUrl}
      youtubeUrl={youtubeUrl}
      twitterUrl={twitterUrl}
    />,
    <SingleEventDonation eventId={eventId} key={2} />,
    ...(type !== "charity"
      ? [<SingleEventsRegisteredVolunteers eventId={eventId} key={3} />]
      : []),
    <SingleEventComment eventId={eventId} key={4} />,
  ];

  return (
    <>
      <BackButton />
      <Box component={Paper} sx={{ p: 3 }}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" width="100%" height={385} />
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="100%" height={80} />
          </>
        ) : (
          <>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 0,
                paddingTop: "33.33%",
              }}
            >
              <Image
                src={bannerImage}
                alt={`${title} banner`}
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: 10,
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px",
                }}
                priority
              />
            </Box>
            <Box my={2}>
              <Typography
                variant="body1"
                color="textSecondary"
                gutterBottom
                fontWeight="SemiBold"
              >
                {moment(startDate).format("dddd, MMMM Do YYYY")}
              </Typography>
              <Typography variant="h4" fontWeight="SemiBold">
                {title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" mt={1}>
                {type} - {city}, {state}
              </Typography>
              <Typography variant="h6" fontWeight="SemiBold" mt={3}>
                Description:
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {description}
              </Typography>
            </Box>
          </>
        )}

        <Stack my={2}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            allowScrollButtonsMobile
            scrollButtons="auto"
          >
            <Tab label="Event Details" />
            <Tab label="Donations" />
            {type !== "charity" && <Tab label="Registered Volunteers" />}
            {type !== "charity" && <Tab label="Comments" />}
          </Tabs>
        </Stack>

        {tabs[tabIndex]}
      </Box>
    </>
  );
};

export default SingleEventDetail;
