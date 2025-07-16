// lib/useFCM.js
"use client";

import { ApiManager } from "@/helpers";
import { getTokenFromFCM } from "@/lib/fcmHelpers";
import { messaging } from "@/lib/firebaseConfig";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useFCM = () => {
  
  const { isLogged, user } = useSelector((state) => state.appReducer);
  
  useEffect(() => {
    const handleFCMToken = async () => {
      try {
        const alreadyHaveToken = localStorage.getItem("device_token");
        const { token, shouldUpdateToken } = await getTokenFromFCM(alreadyHaveToken, messaging);

        // Case 1: User grants permission, old token exists, update the token
    
          // if (alreadyHaveToken) {
            //   await ApiManager({
          //     path: "users/remove-device-token",
          //     method: "post",
          //     params: { deviceToken: alreadyHaveToken },
          //   });
          //   localStorage.removeItem("device_token");
          // }
    
            if (token) {
              await ApiManager({
                path: "users/add-device-token",
                method: "post",
                params: { deviceToken: token },
              });
              localStorage.setItem("device_token", token);
            }
          
        

        // Case 2: User denies permission, remove existing token if present
        // if (!token && alreadyHaveToken && !shouldUpdateToken) {
        //   await ApiManager({
        //     path: "users/remove-device-token",
        //     method: "post",
        //     params: { deviceToken: alreadyHaveToken },
        //   });
        //   localStorage.removeItem("device_token");
        // }
      } catch (error) {
        console.error("Error handling FCM:", error);
      }
    };

    if (messaging && isLogged && user) handleFCMToken();
  }, [isLogged, user]);
};

export default useFCM;
