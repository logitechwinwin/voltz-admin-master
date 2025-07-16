"use client";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/store/reducer";

const NavLink = ({ data, onPress = () => {} }) => {
  const router = useRouter();
  const pathname = usePathname();
  let isSelected = pathname === data.path;
  const dispatch = useDispatch();
  const isOpen = data.children?.some((child) => child?.path === pathname);
  const [open, setOpen] = useState(isOpen);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);

  };

  if (data.children) {
    return (
      <>
        <ListItem sx={{ display: "block", px: 0,pb:0 }} >
          <ListItemButton onClick={handleToggle} sx={{...linkStyles}}>
            <ListItemIcon>{data.icon}</ListItemIcon>
            <ListItemText primary={data.label} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
         <Collapse in={open} timeout="auto" >
        <List component="div" disablePadding>
         { data.children.map((child, index) => (
          <ListItemButton sx={{ ...linkStyles,pl: 5, }}
          onClick={() => {
            router.push(child?.path);
            dispatch(toggleMenu(false));
          }}
          selected={child?.path === pathname}
          >
            <ListItemIcon>
              {child?.icon}
            </ListItemIcon>
            <ListItemText primary={child?.label} />
          </ListItemButton>))}
        </List>
      </Collapse>
      </>
    );
  }

  return (
    <ListItem sx={{ display: "block", px: 0,}}>
      <ListItemButton
        sx={{
          minHeight: 10,
          justifyContent: "initial",
          px: 2.5,

          ...linkStyles,
        }}
        selected={isSelected}
        onClick={() => {
          router.push(data.path);
          onPress();
        }}
      >
        <ListItemIcon>{data.icon}</ListItemIcon>
        <ListItemText primary={data.label} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavLink;

const linkStyles = {
  "&.Mui-selected": {
    "& *": {
      color: (theme) => theme.palette.secondary.main,
      transition: "0.2s all ease-in-out",
    },
  },

  "&:hover": {
    "& *": {
      color: (theme) => theme.palette.secondary.main,
      transition: "0.2s all ease-in-out",
    },
  },
  borderRadius: "0px 9px 9px 0px",
};
