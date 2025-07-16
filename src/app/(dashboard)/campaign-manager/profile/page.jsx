"use client";

import React, { useEffect, useRef, useState } from "react";

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  SecondaryButton,
  DatePicker,
  SelectBox,
  InputField,
  FilePicker,
  PrimaryButton,
  BannerPicker,
  ProfilePicker,
  PhoneNumberField,
} from "@/component";
import BannerProfilePicker from "@/component/BannerProfilePicker/BannerProfilePicker";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast, setUser } from "@/store/reducer";

const UpdateProfile = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({});
  const { user } = useSelector((state) => state.appReducer);
  const params = useSearchParams();

  const dispatch = useDispatch();
  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleFileChange = (file) => {
  //   setFormData({ ...formData, file: file[0].file });
  // };

  useEffect(() => {
    setFormData(user);
    setProfileImage(user?.profileImage);
    setBannerImage(user?.bannerImage);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(handleLoader(true));

    try {
      const { data } = await ApiManager({
        method: "patch",
        header: { "Content-Type": "multipart/form-data" },
        path: `campaign-manager/${user?.id}`,
        params: {
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          phoneNumber: formData?.phoneNumber,

          ...(profileImage && typeof profileImage !== "string" ? { profileImage } : {}),
          ...(bannerImage && typeof bannerImage !== "string" ? { bannerImage } : {}),
        },
      });
      dispatch(setUser(data?.response?.details));
      dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      if (error?.response?.status === 422) {
        setFormErrors(error?.response?.data?.details);
      } else {
        dispatch(setToast({ type: "error", message: error?.message }));
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };
  //   const getSingleCampaignManager = async () => {
  //     dispatch(handleLoader(true));
  //     try {
  //       let { data } = await ApiManager({ path: `campaign-manager/${managerId}` });
  //       console.log("data?.message", data);
  //       setFormData(data?.response?.details);
  //       setProfileImage(data?.response?.details?.profileImage);
  //       setBannerImage(data?.response?.details?.bannerImage);
  //     } catch (error) {
  //       dispatch(setToast({ type: "error", message: error?.message }));
  //     } finally {
  //       dispatch(handleLoader(false));
  //     }
  //   };

  //   useEffect(() => {
  //     if (managerId) getSingleCampaignManager();
  //   }, []);

  return (
    <Container maxWidth="lg" sx={styles.table}>
      {/* --- --- ( Top Heading ) --- --- */}
      <Typography variant="h4" component="h1" fontWeight="bold" color={"text.heading"} mb={2}>
        Update Profile
      </Typography>
      {/* --- --- ( Campaign Manager Detail's Section ) --- --- */}
      {/* <BannerProfilePicker
        profileImage={profileImage}
        bannerImage={bannerImage}
        handleBannerChange={handelBannerChange}
        handleProfileChange={handleProfileChange}
      /> */}
      <Stack component="form" onSubmit={handleSubmit}>
        <Box mt="41px" sx={{ position: "relative" }}>
          <BannerPicker
            previewImage={typeof bannerImage === "string" && bannerImage}
            onImageSelect={(img) => {
              setBannerImage(img[0]?.file);
            }}
            error={formErrors?.bannerImage}
            value={bannerImage}
          />
          <Box sx={{ position: "absolute", top: 100, left: 50, zIndex: 3 }}>
            <ProfilePicker
              previewImage={typeof profileImage === "string" && profileImage}
              onImageSelect={(img) => {
                setProfileImage(img[0]?.file);
              }}
              error={formErrors?.profileImage}
              value={profileImage}
            />
          </Box>
        </Box>
        {/* <SubHeading text="Campaign Manager Details" /> */}
        <Grid container spacing={2} marginY={3} mt={"110px"}>
          <Grid item sm={6} xs={12}>
            <InputField
              required
              label="First Name"
              error={formErrors?.firstName}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <InputField required label="Last Name" error={formErrors?.lastName} name="lastName" value={formData.lastName} onChange={handleChange} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <InputField disabled required label="Email" error={formErrors?.email} name="email" value={formData.email} onChange={handleChange} />
          </Grid>

          <Grid item sm={6} xs={12}>
            <PhoneNumberField
              placeholder="Phone Number"
              size={"large"}
              variant="outlined"
              label="Phone Number"
              name="phoneNumber"
              value={formData?.phoneNumber}
              error={formErrors?.phoneNumber}
              handleInput={handleChange}
              required
            />
          </Grid>
        </Grid>
        {/* --- --- ( Image Picker ) --- --- */}
        {/* <Box mb={4}>
        <SubHeading text="Image Upload" />
        </Box>
        <FilePicker
        name="file"
        value={formData.file}
        onImageSelect={handleFileChange}
        /> */}
        {/* --- --- ( Action Buttons ) --- --- */}
        <Grid container spacing={2} mt={4} justifyContent="center">
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <SecondaryButton onClick={() => router.back()}>Cancel</SecondaryButton>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <PrimaryButton type="submit">Update</PrimaryButton>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default UpdateProfile;

const SubHeading = ({ text = "" }) => (
  <Typography variant="h5" component="h2" fontWeight="SemiBold" color={"text.hint"}>
    {text}
  </Typography>
);

const styles = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
