/* eslint-disable no-unused-vars */
import { InputBase } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1px solid #DEDEDE",
  borderRadius: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexGrow: 1,
  padding: "12px 18px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  //   marginRight: theme.spacing(2),
  //   marginLeft: 0,
  width: "70%",
  //   [theme.breakpoints.up("sm")]: {
  //     marginLeft: theme.spacing(3),
  //     width: "auto",
  //   },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  // padding: theme.spacing(0, 2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  fontFamily: "inter",
  fontWeight: 400,
  "& .MuiInputBase-input": {
    paddingLeft: `${theme.spacing(1.25)}`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));
