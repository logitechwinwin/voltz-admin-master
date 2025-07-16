"use client";

import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  TextField,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ModalWrapper } from "@/component";

import {
  Profile as ProfileImg,
  LocationOnOutlinedIcon,
  VoltzIcon,
  HandHeartIcon,
  UserThreeIcon,
  SDGIcon,
  CalendarIcon,
  CommentIcon,
  HeartOutlineIcon,
  FacebookSharpIcon,
  TwitterIcon,
  LinkedInIcon,
  YoutubeIcon,
  ContentCopyIcon,
} from "@/assets";
import { ProfileBanner, SecondaryButton } from "@/component";
import { ApiManager } from "@/helpers";

const Profile = () => {
  const isSmallScreen = useMediaQuery("(max-width:918px)");
  const { user } = useSelector((state) => state.appReducer);
  const [profileData, setProfileData] = useState({});

  const fetchGoalsAchieved = async () => {
    try {
      const { data } = await ApiManager({
        path: `users/${user.id}/goals-achieved`,
      });
      setProfileData(data?.response?.details);
      console.log("fetchGoalsAchieved", data);
    } catch (error) {
      console.error("Error fetching goals achieved:", error);
    }
  };

  useEffect(() => {
    fetchGoalsAchieved();
    console.log("profileData", profileData);
  }, []);

  return (
    <Container maxWidth="lg">
      <Stack gap={4} pb={3}>
        {/* --- --- ( Profile Banner Section ) --- --- */}
        <ProfileBanner
          bannerImage={user?.bannerImage}
          profileImage={user?.profileImage}
          coverContain
        />

        {/* --- --- ( Profile Title and Social Links Section ) --- --- */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", md: "end" }}
        >
          <Stack gap={2}>
            <Stack
              justifyContent="space-between"
              alignItems="center"
              gap={1}
              width={1}
              direction={{ xs: "column", sm: "row" }}
            >
              <Typography variant="h4" fontWeight="bold">
                {user?.name}
              </Typography>
              <Stack direction="row" gap={1}>
                {user?.facebookUrl && (
                  <Link href={user?.facebookUrl || "#"}>
                    <IconButton>
                      <FacebookSharpIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}

                {user?.youtubeUrl && (
                  <Link href={user?.youtubeUrl || "#"}>
                    <IconButton>
                      <YoutubeIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}
                {user?.TwitterIcon && (
                  <Link href={user?.TwitterIcon || "#"}>
                    <IconButton>
                      <TwitterIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}
                {user?.linkedinUrl && (
                  <Link href={user?.linkedinUrl || "#"}>
                    <IconButton>
                      <LinkedInIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}
              </Stack>
            </Stack>
            <Stack gap={0.5}>
              <Stack direction="row" gap={2}>
                <LocationOnOutlinedIcon color="text.heading" />
                <Typography color="text.heading">{`${user?.city},${user?.country}`}</Typography>
              </Stack>
              {/* <Stack direction="row" gap={2}>
                <LanguageIcon color="text.heading" />
                <Typography color="text.heading">https://rmhc-curacao.org/</Typography>
              </Stack> */}
            </Stack>
          </Stack>
          {user?.certificateOfReg && (
            <Button
              variant="contained"
              LinkComponent={"a"}
              href={user?.certificateOfReg}
              sx={{
                borderRadius: 3,
                textTransform: "capitalize",
                mt: 2.5,
              }}
              size="large"
              target="_blank"
            >
              View Certificate of Registration
            </Button>
          )}
        </Stack>

        {/* --- --- ( Profile Points Section ) --- --- */}

        <Stack
          direction={isSmallScreen ? "column" : "row"}
          justifyContent="space-between"
          gap={3}
        >
          <Stack gap={3} direction="row" flexWrap="wrap">
            <Stack direction="row" alignItems="center" gap={1}>
              <Image src={VoltzIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.voltzEarned || 0}
              </Typography>
            </Stack>
            {/* <Stack direction="row" alignItems="center" gap={1}>
              <Image src={CalendarIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.totalEventsParticipated || 0}
              </Typography>
            </Stack> */}
            {/* <Stack direction="row" alignItems="center" gap={1}>
              <Image src={HandHeartIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.donatedAmount}
              </Typography>
            </Stack> */}
            <Stack direction="row" alignItems="center" gap={1}>
              <Image src={UserThreeIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.followersCount || 0}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <Image src={SDGIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.sdgs?.length || 0}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            width={{ xs: "auto" }}
            gap={3}
            alignItems="center"
          >
            {/* --- --- ( Edit Profile Button ) --- --- */}

            <Stack sx={{ flex: 1, width: "100%" }}>
              <SecondaryButton LinkComponent={Link} href="/ngo/edit-profile">
                Edit Profile
              </SecondaryButton>
            </Stack>

            {/* --- --- ( Share, Like and Comment Icons Section ) --- --- */}

            <Stack flexDirection="row" alignItems="flex-start" gap={3}>
              {/* <Stack>
                <Image src={CommentIcon} alt="" />
                <Typography
                  variant="subTitle1"
                  textAlign="center"
                  color="#C6C6C6"
                >
                  12
                </Typography>
              </Stack> */}
              {/* <Stack>
                <Image src={HeartOutlineIcon} alt="" />
                <Typography
                  variant="subTitle1"
                  fontWeight="ExtraBold"
                  textAlign="center"
                  color="primary.main"
                >
                  21
                </Typography>
              </Stack> */}
            </Stack>
          </Stack>
        </Stack>

        {/* --- --- ( About Section ) --- ---  */}

        <Stack gap={1}>
          <Typography variant="h6" fontWeight="bold" color="text.heading">
            About
          </Typography>
          <Typography
            variant="h6"
            component="p"
            fontWeight="normal"
            color="text.heading"
            dangerouslySetInnerHTML={{
              __html: user?.about?.replace(/\n/g, "<br />"),
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Profile;
