/* eslint-disable no-unused-vars */
"use client";

import { useContext, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { Loader, SplashScreen, Toast } from "@/component";
import { authRoutes } from "@/constant";
import { SocketContext } from "@/context/socketReducer";
import { ApiManager, createCookie, deleteCookie } from "@/helpers";
import useFCM from "@/hooks/useFCM";
import useHandleForeGroundNotifications from "@/hooks/useHandleForeGroundNotifications";
import { setUser } from "@/store/reducer";

const AppProvider = ({ children }) => {
  useFCM();
  useHandleForeGroundNotifications();

  const [loading, setLoading] = useState(true);
  const { state, connectSocket } = useContext(SocketContext);
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      try {
        let token = localStorage.getItem(process.env.NEXT_PUBLIC_APP_TOKEN);
        if (!token && !authRoutes.includes(path)) {
          router.push("/login");
        }
        if (token) {
          let { data } = await ApiManager({ path: "auth/me" });
          dispatch(setUser(data?.response?.details));
          createCookie(JSON.stringify(data?.response?.details));
          if (!state.socket) {
            connectSocket();
          }
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.status == 401) {
          localStorage.removeItem(process.env.NEXT_PUBLIC_APP_TOKEN);
          deleteCookie();
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading ? <SplashScreen /> : children}
      <Loader />
      <Toast />
    </>
  );
};

export default AppProvider;
