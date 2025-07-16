import { useEffect, useState } from "react";
import { requestNotificationPermission } from "../lib/firebase";

const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const initializeFCM = async () => {
      const { isSupported } = await import("firebase/messaging");
      if (! await isSupported()) {
        console.warn("FCM not supported in this browser");
        return;
      }
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      let token;
      const isServiceWorkerIsReady = await navigator.serviceWorker.ready;
      if (isServiceWorkerIsReady) {
        token = await requestNotificationPermission(registration);
      }
      if (token) {
        setFcmToken(token);
      }
    };
    // if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      initializeFCM();
    // }
  }, []);

  return { fcmToken };
};

export default useFirebaseMessaging;
