/* eslint-disable no-unused-vars */
"use client";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";
import { BannerPicker, ProfilePicker } from "@/component";
import { DummyBanner, DummyProfile } from "@/assets";
import BackButton from "@/component/BackButton/BackButton";

const User = ({ params }) => {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const fromCompanies = router.query?.fromCompanies === "true";
  console.log("🚀 ~ User ~ fromCompanies:", fromCompanies)

  useEffect(() => {
    const getSingleUser = async () => {
      dispatch(handleLoader(true));
      try {
        let { data } = await ApiManager({
          method: "get",
          path: `users/${params?.userId}`,
        });
        setUser(data?.response?.details);
      } catch (error) {
        dispatch(setToast({ type: "error", message: error?.message }));
      } finally {
        dispatch(handleLoader(false));
      }
    };

    if (params?.userId) {
      getSingleUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleApproval = async (status) => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "put",
        path: `admin/manage-user-kyc/${params?.userId}`,
        params: {
          registrationStatus: status,
        },
      });
      dispatch(setToast({ type: "success", message: data?.message }));
      router.push('/admin/kyc-verification');
    } catch (error) {
      dispatch(
        setToast({ type: "error", message: error?.response?.data?.message })
      );
    } finally {
      dispatch(handleLoader(false));
    }
  };

  return (
    <>
      <BackButton />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography fontWeight="SemiBold" variant="h4">
          Details
        </Typography>
        <Stack direction="row" gap={2}>
          {user?.registrationStatus === "approved" ? (
            <Typography color="primary" fontWeight="SemiBold">
              Approved!
            </Typography>
          ) : user?.registrationStatus === "rejected" ? (
            <Stack direction='row' gap={1} alignItems='center'>
              <Button variant="contained" onClick={() => handleApproval("approved")}>
                Approve
              </Button>
              <Typography color="error" fontWeight="SemiBold">
                Rejected!
              </Typography>
            </Stack>
          ) : (
            <>
              <Button variant="contained" onClick={() => handleApproval("approved")}>
                Approve
              </Button>
              <Button variant="contained" color="error" onClick={() => handleApproval("rejected")}>
                Reject
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ position: "relative" }} mb={13}>
          <BannerPicker
            previewImage={user?.bannerImage || DummyBanner}
            disable
            dummyImg={!user?.bannerImage}
          />
          <Box
            sx={{
              position: "absolute",
              top: 100,
              left: { xs: 20, md: 50 },
              zIndex: 3,
            }}
          >
            <ProfilePicker
              previewImage={user?.profileImage || DummyProfile.src}
              disable
            />
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Title text="Organization Details" />
          <ShowDetails
            label={`${user?.role == "company" ? "Company" : "NGO"} Name`}
            value={user.name}
          />
          <ShowDetails label="Registration Num" value={user.regNumber} />
          <ShowDetails
            label="Date of Incorporation"
            value={moment(user.dateOfReg).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
          />
          <ShowDetails
            label="Tax Identification Num"
            value={user.taxIdentificationNumber}
          />
          <Title text="Address" mT={3} />
          <ShowDetails label="Street Address" value={user.streetAddress} />
          <ShowDetails label="Country" value={user.country} />
          <ShowDetails label="State" value={user.state} />
          <ShowDetails label="City" value={user.city} />
          <ShowDetails label="Postal Code" value={user.postalCode} />
          <Title text="Key Personnel" mT={3} />
          <ShowDetails label="First Name" value={user.firstName} />
          <ShowDetails label="Last Name" value={user.lastName} />
          <ShowDetails label="Role" value={user.role} />
          <ShowDetails label="Email" value={user.email} />
          <Title text="Status" mT={3} />
          <ShowDetails
            label="Registration Status"
            value={user.registrationStatus}
          />
          <ShowDetails
            label="Created At"
            value={moment(user.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
          />
          {/* <ShowDetails label="Phone Number" value={user.phoneNumber} /> */}
          {/* <Image src={user?.profileImage} alt="" width={250} height={250} /> */}
          <Grid item xs={12}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent={user?.role == "ngo" ? "start" : "center"}
              px={{ xs: 0 }}
              mt={3}
              gap={3}
            >
              <Button
                variant="contained"
                LinkComponent={"a"}
                href={user?.certificateOfReg}
                sx={{
                  borderRadius: 3,
                  textTransform: "capitalize",
                  ...(user?.role == "ngo" && { width: { md: "40%" } }),
                }}
                size="large"
                fullWidth
                target="_blank"
              >
                View Certificate of Registration
              </Button>
              {user?.role === "company" && (
                <Button
                  target="_blank"
                  variant="contained"
                  LinkComponent={"a"}
                  href={user?.csrPolicyDoc}
                  sx={{ borderRadius: 3, textTransform: "capitalize" }}
                  size="large"
                  fullWidth
                >
                  View CSR Policy Document
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default User;

const ShowDetails = ({ label, value }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Grid item xs={12} md={6}>
      <Stack direction="row" flexWrap={isSmallScreen && "wrap"}>
        <Typography fontWeight="SemiBold" sx={{ whiteSpace: "nowrap" }}>
          {label} : &nbsp;
        </Typography>
        <Tooltip title={!isSmallScreen && value}>
          <Typography
            sx={{
              ...(isSmallScreen
                ? {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }
                : {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }),
            }}
          >
            {value || "-"}
          </Typography>
        </Tooltip>
      </Stack>
    </Grid>
  );
};

const Title = ({ text = "", mT = 2 }) => {
  return (
    <Grid item xs={12} marginY={1} mt={mT}>
      <Typography variant="h5" fontWeight="bold">
        {text}
      </Typography>
    </Grid>
  );
};
