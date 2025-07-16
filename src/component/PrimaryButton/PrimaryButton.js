/* eslint-disable no-unused-vars */
import { Button, styled } from "@mui/material";

const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: "100vw",
  fontWeight: "600",
}));

PrimaryButton.defaultProps = {
  variant: "contained",
  fullWidth: true,
  size: "large"
};

export default PrimaryButton;
