"use client";

import { useEffect, useState } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { ArrowForwardOutlinedIcon } from "@/assets";
import { InputField } from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const VerifyOtp = () => {
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
        path: "auth/verify-otp",
        params: formData,
      });
      showMessage("success", data?.message);
      localStorage.setItem("@OTP_ID", data?.response?.details?.otpId);
      router.push("/reset-password");
    } catch (error) {
      throwError(error);
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const handleResend = async () => {
    setFormErrors({});
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "post",
        path: "auth/resend-otp",
        params: { email: formData?.email },
      });
      showMessage("success", data?.message);
    } catch (error) {
      throwError(error);
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const throwError = (error) => {
    if (error?.code == "ERR_NETWORK") {
      showMessage("error", error?.message);
    } else if (error?.response?.status == 422) {
      showMessage("error", error?.response?.data?.message);
      setFormErrors(error?.response?.data?.details);
    } else {
      showMessage("error", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    let email = localStorage.getItem("@OTP_EMAIL");
    if (email) {
      console.log(email);
      setFormData((prev) => ({
        ...prev,
        email: email,
      }));
    }
  }, []);

  return (
    <Box width="100%" component="form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Stack gap={1}>
          <Typography sx={{ fontWeight: "bold" }} variant="h5">
            Verification Code
          </Typography>
          <Typography color="#8f8f8f" variant="body2">
            We have sent the verification code to your email
          </Typography>
        </Stack>
        <InputField
          placeholder="Enter OTP"
          label="Enter OTP"
          name="otp"
          variant="standard"
          value={formData?.otp}
          error={formErrors?.otp}
          onChange={handleInputChange}
          helperText={
            <Typography sx={{ my: 0.5 }} component="span">
              Did not receive the code?{" "}
              <Button onClick={handleResend}>
                <Typography component="span" color="secondary">
                  Resend {<ArrowForwardOutlinedIcon sx={{ color: "secondary" }} />}
                </Typography>
              </Button>
            </Typography>
          }
        />
        <Button type="submit" variant="contained" sx={{ borderRadius: 5, mt: 1.5 }} size="large">
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default VerifyOtp;
