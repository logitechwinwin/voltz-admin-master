"use client";

import * as React from "react";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Container, Stack, Typography, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfilePicWIthInfo from "./ProfilePicWIthInfo";
import { MyWallet, VoltzModal } from "..";
import { ExpandMoreIcon, MenuIcon, VoltzIcon } from "@/assets";
import { DRAWER_BREAK_POINT } from "@/constant";
import { SocketContext } from "@/context/socketReducer";
import { ApiManager, deleteCookie } from "@/helpers";
import { handleLoader, logoutUser, toggleMenu } from "@/store/reducer";
import Image from "next/image";

export default function PrimarySearchAppBar() {
  const { disconnectSocket } = React.useContext(SocketContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openWallet, setOpenWallet] = React.useState(false);
  const matches = useMediaQuery(DRAWER_BREAK_POINT);
  const router = useRouter();
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const mobileScreen = useMediaQuery("(max-width:1000px)");
  const { user, openMenu, walletBalance } = useSelector((state) => state.appReducer);
  const isCampaignManager = user?.role === "campaign_manager";
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    let alreadyHaveToken = localStorage.getItem("device_token");

    dispatch(handleLoader(true));
    try {

      await ApiManager({
        method: "post",
        path: "auth/logout",
      });
      await deleteCookie();
      localStorage.removeItem(process.env.NEXT_PUBLIC_APP_TOKEN);
      disconnectSocket();
      handleMenuClose();
      router.push("/login");
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error);
    } finally {
      dispatch(handleLoader(false));
      dispatch(logoutUser(true));
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      disableScrollLock
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <ProfilePicWIthInfo />
      </Box>
      {isCampaignManager && (
        <>
          <Link href="/campaign-manager/profile">
            <MenuItem onClick={handleMenuClose}>Profile </MenuItem>
          </Link>
          <Link href="/campaign-manager/change-password">
            <MenuItem onClick={handleMenuClose}>Change Password </MenuItem>
          </Link>
        </>
      )}
      {user?.role === "ngo" && (
        <div>
          <Link href="/ngo/profile">
            <MenuItem onClick={handleMenuClose}>Profile </MenuItem>
          </Link>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              setOpenModal(true);
            }}
          >
            Buy Voltz{" "}
          </MenuItem>
        </div>
      )}
      {/* {user?.role !== "admin" && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setOpenWallet(true);
          }}
        >
          My Wallet{" "}
        </MenuItem>
      )} */}
      {user?.role === "company" && (
        <Link href="/company/profile">
          <MenuItem onClick={handleMenuClose}>Profile </MenuItem>
        </Link>
      )}
      {user?.role === "admin" && (
        <Link href="/admin/update-profile">
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        </Link>
      )}
      {user?.role === "admin" && (
        <Link href="/admin/create-admin">
          <MenuItem onClick={handleMenuClose}>Create Admin</MenuItem>
        </Link>
      )}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      {user?.role === "ngo" && (
        <div>
          <Link href="/ngo/profile">
            <MenuItem onClick={handleMenuClose}>Profile </MenuItem>
          </Link>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              setOpenModal(true);
            }}
          >
            Buy Voltz{" "}
          </MenuItem>
        </div>
      )}
      {/* {user?.role !== "admin" && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setOpenWallet(true);
          }}
        >
          My Wallet{" "}
        </MenuItem>
      )} */}
      {user?.role === "company" && (
        <Link href="/company/profile">
          <MenuItem onClick={handleMenuClose}>Profile </MenuItem>
        </Link>
      )}
      {user?.role === "admin" && (
        <Link href="/admin/update-profile">
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        </Link>
      )}
      {user?.role === "admin" && (
        <Link href="/admin/create-admin">
          <MenuItem onClick={handleMenuClose}>Create Admin</MenuItem>
        </Link>
      )}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={
          matches
            ? {
              width: "calc(100% - 62px)",
              ml: "62px",
              background: "white",
              color: "black",
            }
            : { background: "white", color: "black" }
        }
      >
        <Container sx={{ maxWidth: "2560px !important", px: { lg: "20px" } }}>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{ height: "100%", py: "12px" }}
            spacing={{ sm: 1.5 }}
          >
            {/* {mobileScreen && ( */}
            <IconButton onClick={() => dispatch(toggleMenu(!openMenu))}>
              <MenuIcon />
            </IconButton>
            <Stack direction='row'>
              {user?.role !== 'admin' && <Stack
                direction="row"
                // gap={1}
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  variant="h5"
                  fontWeight="medium"
                  sx={{ textAlign: "center" }}
                >
                  {parseFloat(Number(walletBalance).toFixed(2)) || 0}
                </Typography>
                <Image
                  src={VoltzIcon}
                  alt="Voltz Icon"
                  width={22}
                  priority
                  style={{ alignSelf: "center" }}
                />
              </Stack>
              }
              <IconButton
                size="large"
                color="inherit"
                LinkComponent={Link}
                href={
                  isCampaignManager
                    ? `/campaign-manager/notifications`
                    : `/${user?.role}/notifications`
                }
              >
                <NotificationsIcon />
              </IconButton>
              <IconButton
                size="large"
                aria-controls={menuId}
                onClick={handleProfileMenuOpen}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Stack>
          </Stack>
          <VoltzModal openModal={openModal} setOpenModal={setOpenModal} />
          <MyWallet open={openWallet} setOpen={setOpenWallet} />
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
