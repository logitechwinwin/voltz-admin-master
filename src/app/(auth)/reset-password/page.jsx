"use client";

import { useEffect, useState } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";

import { InputField } from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const ResetPassword = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    reEnterPassword: "",
  });

  // Hooks for router navigation and dispatching actions
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userToken = searchParams.get("userToken");

  const { newPassword, reEnterPassword } = formData;

  // Function to display toast messages
  const showMessage = (type, msg) => dispatch(setToast({ type: type, message: msg }));

  // Handle input change and update form data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function to check form input
  const validate = () => {
    let obj = {};

    // Check if the password is at least 6 characters long
    if (newPassword?.length < 6) {
      obj.newPassword = "The new password field must be at least 6 characters.";
    }

    // Check if the password field is empty
    if (newPassword == "" || !newPassword) {
      obj.newPassword = "The new password field is required.";
    }

    // Check if the re-entered password matches the original password
    if (reEnterPassword != newPassword) {
      obj.reEnterPassword = "New password does not match";
    }

    // Check if the re-enter password field is empty
    if (reEnterPassword == "" || !reEnterPassword) {
      obj.reEnterPassword = "The re-enter new password field is required.";
    }

    if (Object.keys(obj)?.length) {
      setFormErrors(obj);
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      return;
    }
    setFormErrors({});
    dispatch(handleLoader(true));
    try {
      // eslint-disable-next-line no-unused-vars
      const { reEnterPassword, ...newFormData } = formData;
      let { data } = await ApiManager({
        method: "post",
        path: "auth/reset-password",
        params: newFormData,
      });
      showMessage("success", data?.message);
      localStorage.removeItem("@OTP_ID");
      localStorage.removeItem("@OTP_EMAIL");
      router.push("/login");
    } catch (error) {
      if (error?.code == "ERR_NETWORK") {
        showMessage("error", error?.message);
      } else if (error?.response?.status == 422) {
        showMessage("error", error?.response?.data?.message);
        setFormErrors(error?.response?.data?.details);
      } else {
        showMessage("error", error?.response?.data?.message);
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };

  useEffect(() => {
    let otpId = localStorage.getItem("@OTP_ID");
    if (userToken) {
      setFormData((prev) => ({
        ...prev,
        userToken: userToken,
      }));
    } else if (otpId) {
      console.log(otpId);
      setFormData((prev) => ({
        ...prev,
        otpId: otpId,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box width="100%" component="form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Stack gap={1}>
          <Typography sx={{ fontWeight: "bold" }} variant="h5">
            Reset Your Password
          </Typography>
          <Typography color="#8f8f8f" variant="body2">
            Enter your new password
          </Typography>
        </Stack>
        <Stack gap={2}>
          <InputField
            placeholder="Enter New Password"
            label="Enter New Password"
            name="newPassword"
            variant="standard"
            value={formData?.newPassword}
            error={formErrors?.newPassword}
            onChange={handleInputChange}
          />
          <InputField
            placeholder="Re-Enter New Password"
            label="Re-Enter New Password"
            variant="standard"
            name="reEnterPassword"
            value={formData?.reEnterPassword}
            error={formErrors?.reEnterPassword}
            onChange={handleInputChange}
          />
        </Stack>
        <Button type="submit" variant="contained" sx={{ borderRadius: 5, mt: 1.5 }} size="large">
          Reset Password
        </Button>
      </Stack>
    </Box>
  );
};

export default ResetPassword;
