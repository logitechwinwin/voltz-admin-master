import { styled } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { DRAWER_WIDTH } from "@/constant";

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  borderRadius: "0px 0px 24px 0px",
  overflow: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflow: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  borderRadius: "0px 0px 24px 0px",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const HoverCloseDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "fixed",
  zIndex: "1300",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
    "& body": {
      overflow: "hidden",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
    "& body": {
      overflow: "auto",
    },
  }),
}));

export const styles = {
  drawerMainBox: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
    py: "24px",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
};
