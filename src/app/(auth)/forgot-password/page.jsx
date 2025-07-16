"use client";

import { useState } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { InputField } from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const ForgotPassword = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();

  // Function to display toast messages
  const showMessage = (type, msg) => dispatch(setToast({ type: type, message: msg }));

  // Handle input change and update form data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "post",
        path: "auth/forget-password",
        params: formData,
      });
      showMessage("success", data?.message);
      localStorage.setItem("@OTP_EMAIL", formData?.email);
      router.push(`/verify-otp`);
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

  return (
    <Box width="100%" component="form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Stack gap={1}>
          <Typography sx={{ fontWeight: "bold" }} variant="h5">
            Enter Your Email
          </Typography>
          <Typography color="#8f8f8f" variant="body2">
            Use the email you used to create your account before.
          </Typography>
        </Stack>
        <InputField
          placeholder="Enter Email"
          label="Email"
          name="email"
          variant="standard"
          value={formData?.email?.toLowerCase()}
          error={formErrors?.email}
          onChange={handleInputChange}
        />
        <Button type="submit" variant="contained" sx={{ borderRadius: 5, mt: 1.5 }} size="large">
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default ForgotPassword;
