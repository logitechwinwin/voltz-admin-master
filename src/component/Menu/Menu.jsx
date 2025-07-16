/* eslint-disable no-unused-vars */
"use client";

import * as React from "react";

import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { MoreHorizIcon, MoreVertIcon } from "@/assets";

export default function BasicMenu({ disableBtn = false, size = "38px", verticalIcon = false, disabled = false, setOpenMenu, openMenu, children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {!verticalIcon ? (
        <IconButton disabled={disabled} onClick={handleClick}>
          <MoreHorizIcon
            sx={{
              color: "primary.neutralGrey",
              fontSize: size,
              cursor: "pointer",
            }}
            id="basic-button"
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
          />
        </IconButton>
      ) : (
        <MoreVertIcon
          sx={{
            color: "primary.neutralGrey",
            fontSize: "28px",
            cursor: "pointer",
          }}
          id="basic-button"
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleClick}
        />
      )}
      <Menu
        disableScrollLock
        id="basic-menu"
        anchorEl={anchorEl}
        open={open || openMenu}
        onClick={handleClose}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        elevation={2}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "15px",
          },
          "& .MuiButtonBase-root": {
            pr: 5,
            color: "#7B7B80",
          },
          "& .MuiPaper-elevation": {
            boxShadow: "0px 21.49px 51.57px 0px rgba(0, 0, 0, 0.09)",
          },
        }}
      >
        {children}
      </Menu>
    </div>
  );
}
