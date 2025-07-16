import { Button, styled } from "@mui/material";

const SecondaryButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "sx",
})(({ theme, sx }) => ({
  borderRadius: "100vw",
  fontWeight: "600",
  background: "white",
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  borderWidth: "2px",
  ":hover": {
    borderWidth: "2px",
    borderColor: theme.palette.secondary.light,
  },
  ...sx,
}));

SecondaryButton.defaultProps = {
  variant: "outlined",
  fullWidth: true,
  size: "large",
  sx: {},
};

export default SecondaryButton;
