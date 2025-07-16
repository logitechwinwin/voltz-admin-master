import { Button, CircularProgress, Stack, Typography } from "@mui/material";

const CardButton = ({ children, style, icon, variant, textStyle, onClick, loading, ...props }) => {
  return (
    <Button
      variant={variant || "outlined"}
      startIcon={icon || ""}
      fullWidth
      onClick={onClick}
      sx={{
        color: variant === "contained" ? "#fff" : "secondary.main",
        borderRadius: "53px",
        width: "100%",
        border: variant !== "contained" && "2px solid",
        backgroundColor: variant === "contained" ? "" : "#fff",
        "&:hover": {
          backgroundColor: variant === "contained" ? "" : "#fff",
          border: variant !== "contained" && "2px solid",
        },
        ...style,
      }}
      {...props}
    >
      <Typography {...textStyle} component={Stack} alignItems="center" justifyContent="center">
        {loading ? <CircularProgress size={24} color="inherit" /> : children}
      </Typography>
    </Button>
  );
};
export default CardButton;
