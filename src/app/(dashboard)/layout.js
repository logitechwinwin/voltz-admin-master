"use client";
import { useEffect } from "react";
import { Box, Container, useMediaQuery } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Header, Drawer } from "@/component";
import { authRoutes, DRAWER_BREAK_POINT, drawerRoutes } from "@/constant";

export default function DashboardLayout({ children }) {
  const matches = useMediaQuery(DRAWER_BREAK_POINT);
  const router = useRouter();
  const { user, isLogged } = useSelector((state) => state.appReducer);
  const path = usePathname();
  useEffect(() => {
    if (!isLogged && !authRoutes?.includes(path)) {
      console.log("dashboard", isLogged);
      router.push("/login");
    }
  }, [isLogged]);

  return (
    <>
      <Drawer routes={drawerRoutes[user?.role]} />
      <Header />
      <Box sx={styles.mainBoxSx(matches)}>
        <Container sx={styles.containerSx}>
          <Box component="main">{children}</Box>
        </Container>
      </Box>
    </>
  );
}

const styles = {
  mainBoxSx: (matches) =>
    matches
      ? { width: "calc(100% - 62px)", ml: "62px", py: "20px" }
      : { py: "20px" },
  containerSx: { maxWidth: "1440px !important", px: { lg: "27px" } },
};
