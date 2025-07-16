"use client";
import {
  Box,
  Stack,
  useMediaQuery,
  Drawer as MuiDrawer,
  List,
} from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import NavLink from "./NavLink";
import { HoverCloseDrawer, styles } from "./styles";
import { toggleMenu } from "../../store/reducer";
import { Logo } from "@/assets";
import { DRAWER_BREAK_POINT } from "@/constant";
import { useState } from "react";
import UIScrollbar from "../UIScrollbar/UIScrollbar";

export default function Drawer({ routes }) {
  const { openMenu } = useSelector((state) => state.appReducer);
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();
  const matches = useMediaQuery(DRAWER_BREAK_POINT);

  // Render drawer items
  const renderDrawerItem = () => {
    return (
      <Box>
        <List>
          {routes?.map((eachRoute, index) => {      
            return(
            <NavLink
              data={eachRoute}
              key={index}
              onPress={() => {
                dispatch(toggleMenu(false));
              }}
              openDrawer={openDrawer}
            />
          )})}
        </List>
      </Box>
    );
  };

  const renderLogo = () => {
    return (
      <Box>
        <Image src={Logo} width={"48px"} height={"48px"} alt="logo" />
      </Box>
    );
  };

  return (
    <>
      {matches ? (
        <HoverCloseDrawer
          variant={"permanent"}
          open={openDrawer}
          onMouseEnter={() => setOpenDrawer(true)}
          onMouseLeave={() => setOpenDrawer(false)}
          PaperProps={{
            elevation: 6,
          }}
        >
          <Box sx={styles.drawerMainBox}>
            {renderLogo()}
            <UIScrollbar sx={{ height: "calc(100% - 100px)", width: "100%" }}>
              {renderDrawerItem()}
            </UIScrollbar>
          </Box>
        </HoverCloseDrawer>
      ) : (
        <MuiDrawer
          variant="temporary"
          open={openMenu}
          onClose={() => dispatch(toggleMenu(!openMenu))}
        >
          <Stack>
            <Box sx={styles.drawerMainBox}>{renderLogo()}</Box>
            <Box sx={{ width: 250 }}>{renderDrawerItem()}</Box>
          </Stack>
        </MuiDrawer>
      )}
    </>
  );
}
