/* eslint-disable no-unused-vars */
import * as React from "react";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from "@mui/material";

export default function AlertDialog({ message = "", handleClose }) {
  // Split the message at the first period.
  const parts = message.split(".");
  // Extract the title and subtitle, trimming any excess whitespace.
  const title = parts[0].trim() + ".";
  const subTitle = parts.slice(1).join(".").trim();

  return (
    <React.Fragment>
      <Dialog open={!!message} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{subTitle}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
