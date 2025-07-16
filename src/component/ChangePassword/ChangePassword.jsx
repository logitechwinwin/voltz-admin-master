"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBackIosIcon, VisibilityIcon, VisibilityOffIcon } from "@/assets";
import { InputField, PrimaryButton, SecondaryButton } from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

function ChangePassword({ role }) {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const isCampaignManger = role === "campaign-manager";
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const { password, newPassword, confirmPassword } = formData;

    // Validation for new password and confirm password match
    if (newPassword !== confirmPassword) {
      setFormErrors({
        confirmPassword: "Passwords do not match",
      });
      return;
    }
    dispatch(handleLoader(true));

    try {
      let { data } = await ApiManager({
        method: "patch",
        path: "auth/change-password",
        params: { newPassword, password },
      });
      console.log("data?.message", data);
      dispatch(setToast({ type: "success", message: data?.message }));
      if (isCampaignManger) router.push("/campaign-manger/events");
      setFormData({});
    } catch (error) {
      const errorResponse = error?.response?.data;
      console.log(errorResponse);

      if (errorResponse?.statusCode === 400) {
        setFormErrors({
          password: "The old password is incorrect",
        });
      } else if (errorResponse?.statusCode === 422) {
        setFormErrors(errorResponse?.details);
      } else {
        dispatch(setToast({ type: "error", message: error?.message }));
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };

  // Handle input changes and form validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      if (value !== formData?.newPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Password do not matched",
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

  return (
    <Container py={6} maxWidth="sm">
      <Box component={"form"} onSubmit={handleSubmit} py={7}>
        <Button
          startIcon={<ArrowBackIosIcon />}
          sx={{ mb: 4 }}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" fontWeight={"bold"}>
            Change Password
          </Typography>
        </Stack>

        <Stack mt={"20px"} spacing={6}>
          {/* ----------------------------- Key Personnel (Start) -----------------------------*/}
          <Box>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item xs={12}>
                <InputField
                  required
                  label="Old Password"
                  name="password"
                  type={showOldPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {!showOldPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={formData?.password}
                  error={formErrors?.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  required
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {!showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={formData?.newPassword}
                  error={formErrors?.newPassword}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  required
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {!showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={formData?.confirmPassword}
                  error={formErrors?.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={"10px"}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item sm={4} xs={12}>
                <SecondaryButton onClick={() => router.back()}>
                  Cancel
                </SecondaryButton>
              </Grid>
              <Grid item sm={4} xs={12}>
                <PrimaryButton type="submit">Submit</PrimaryButton>
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

export default ChangePassword;
