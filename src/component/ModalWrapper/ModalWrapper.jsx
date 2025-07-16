/* eslint-disable no-unused-vars */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Typography, useMediaQuery } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";

const ModalWrapper = ({ children, open = false, handleClose = () => {}, title, maxWidth, fullScreen, handleBack, transition = false, sx }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const TransitionComponent = transition ? Fade : undefined;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth={"true"}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      TransitionComponent={TransitionComponent}
      transitionDuration={transition ? 500 : 100}
      sx={sx}
    >
      {handleBack && (
        <IconButton
          aria-label="close"
          onClick={handleBack}
          sx={{
            position: "absolute",
            left: 8,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="SemiBold">
          {title && title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ m: 0 }}> {children}</DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
