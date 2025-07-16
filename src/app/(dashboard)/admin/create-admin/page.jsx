"use client";
import React, { useEffect, useState } from "react";

import { Box, Button, Container, Grid, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { ArrowBackIosIcon, VisibilityIcon, VisibilityOffIcon } from "@/assets";
import { InputField, PhoneNumberField, PrimaryButton, SecondaryButton } from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast, setUser } from "@/store/reducer";

function Admin() {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const path = usePathname();
  const updatedPath = path.split("/");
  const isUpdateProfile = updatedPath[updatedPath?.length - 1] === "update-profile";
  const { user } = useSelector((state) => state.appReducer);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData?.phoneNumber?.length < 7) {
      setFormErrors({ phoneNumber: "Invalid phone number" });
      return;
    }
    dispatch(handleLoader(true));
    setFormErrors({});
    const { firstName, lastName, email, password, phoneNumber } = formData;
    try {
      let { data } = await ApiManager({
        method: isUpdateProfile ? "patch" : "post",
        path: "admin",
        params: { firstName, lastName, email, ...(!isUpdateProfile && { password }), ...(phoneNumber && { phoneNumber }) },
      });
      console.log("data?.message", data);
      dispatch(setUser(data?.response?.details));
      dispatch(setToast({ type: "success", message: data?.message }));
      if (!isUpdateProfile) {
        setFormData({});
      }
      router.back();
    } catch (error) {
      console.log(error?.response?.data);

      if (error?.response?.data?.statusCode === 422) {
        setFormErrors(error.response.data.details);
      } else {
        dispatch(setToast({ type: "error", message: error?.message }));
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Password does not matched",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isUpdateProfile) {
      setFormData(user);
    } else {
      setFormData({});
      setFormErrors({});
    }
  }, [isUpdateProfile]);

  return (
    <Container py={6}>
      <Box component={"form"} onSubmit={handleSubmit} py={7}>
        <Button startIcon={<ArrowBackIosIcon />} sx={{ mb: 4 }} onClick={() => router.back()}>
          Back
        </Button>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" fontWeight={"bold"}>
            {isUpdateProfile ? "Update Profile" : "Create Super Admin"}
          </Typography>
          {isUpdateProfile && (
            <Button LinkComponent={Link} href="/admin/change-password">
              Change Password
            </Button>
          )}
        </Stack>

        <Stack mt={"20px"} spacing={6}>
          {/* ----------------------------- Key Personnel (Start) -----------------------------*/}
          <Box>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  label="First Name"
                  name="firstName"
                  value={formData?.firstName}
                  error={formErrors?.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  label="Last Name"
                  name="lastName"
                  value={formData?.lastName}
                  error={formErrors?.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  type="email"
                  label="Email"
                  name="email"
                  value={formData?.email}
                  error={formErrors?.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                {/* <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  type="number"
                  value={formData?.phoneNumber}
                  error={formErrors?.phoneNumber}
                  onChange={handleInputChange}
                /> */}
                <PhoneNumberField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData?.phoneNumber}
                  error={formErrors?.phoneNumber}
                  handleInput={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              {!isUpdateProfile && (
                <>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      required
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
                              {!showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={formData?.password}
                      error={formErrors?.password}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      required
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {!showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={formData?.confirmPassword}
                      error={formErrors?.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>

          <Box mt={"10px"}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item sm={4} xs={12}>
                <SecondaryButton onClick={() => router.back()}>Cancel</SecondaryButton>
              </Grid>
              <Grid item sm={4} xs={12}>
                <PrimaryButton type="submit">{isUpdateProfile ? "Update" : "Submit"}</PrimaryButton>
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- END -----------------------------*/}
        </Stack>
      </Box>
      {/* <KycDialogBox
        message={modalText}
        handleClose={() => {
          setModalText("");
          router.push("/login");
        }}
      /> */}
    </Container>
  );
}

export default Admin;
