"use client";
import { useContext, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { VisibilityIcon, VisibilityOffIcon } from "@/assets";
import { InputField } from "@/component";
import { SocketContext } from "@/context/socketReducer";
import { ApiManager, createCookie } from "@/helpers";
import { handleLoader, setToast, setUser } from "@/store/reducer";

const Login = () => {
  const { connectSocket } = useContext(SocketContext);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: "panel",
    loginType: "email",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  // Function to display toast messages
  const showMessage = (type, msg) =>
    dispatch(setToast({ type: type, message: msg }));

  // Handle input change and update form data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormErrors({});
    dispatch(handleLoader(true));
    const { email, ...rest } = formData;
    try {
      let { data } = await ApiManager({
        method: "post",
        path: "auth/sign-in",
        params: {
          ...rest,
          email: email.toLowerCase().trim(),
        },
      });
      const role = data?.response?.details?.role;
      await createCookie(JSON.stringify(data?.response?.details));
      if (role === "ngo") {
        router.push("/ngo/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "company") {
        router.push("/company/dashboard");
      } else if (role === "campaign_manager") {
        router.push("/campaign-manager/campaign");
      }
      localStorage.setItem(
        process.env.NEXT_PUBLIC_APP_TOKEN,
        data?.response?.accessToken
      );
      connectSocket();
      showMessage("success", data?.message);
      dispatch(setUser(data?.response?.details));
      connectSocket();
      // router.push("/home");
    } catch (error) {
      console.log("🚀 ~ handleLogin ~ error:", error);
      if (error?.code == "ERR_NETWORK") {
        showMessage("error", error?.message);
      } else if (error?.response?.status == 422) {
        // showMessage("error", error?.response?.data?.message);
        setFormErrors(error?.response?.data?.details);
      } else {
        showMessage("error", error?.response?.data?.message);
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };
  return (
    <Box component={"form"} width="100%" onSubmit={handleLogin}>
      <Stack gap={4}>
        <Box>
          {/* <Typography variant="body1">NGOs</Typography> */}
          <Typography variant="h4" fontWeight="bold">
            Sign In
          </Typography>
        </Box>
        <Stack spacing={2}>
          <InputField
            placeholder="Enter Email"
            label="Email"
            name="email"
            required
            variant="standard"
            value={formData?.email}
            error={formErrors?.email}
            onChange={handleInputChange}
            size="medium"
          />
          <InputField
            placeholder="Enter Password"
            label="Password"
            name="password"
            required
            type={showPassword ? "text" : "password"}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={formData?.password}
            error={formErrors?.password}
            onChange={handleInputChange}
            size="medium"
          />
          <Stack justifyContent={"space-between"} direction={"row"}>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember me"
            />
            <Button
              sx={Styles.forgotbutton}
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </Button>
          </Stack>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          sx={{ borderRadius: 3, textTransform: "capitalize" }}
          size="large"
        >
          Log In
        </Button>
        <Stack>
          <Button LinkComponent={Link} href="/ngo-kyc">
            Register as NGO
          </Button>
          <Button LinkComponent={Link} href="/company-kyc">
            Register as Company
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Login;

const Styles = {
  button: {
    textTransform: "capitalize",
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  forgotbutton: {
    color: "#757575",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
};
