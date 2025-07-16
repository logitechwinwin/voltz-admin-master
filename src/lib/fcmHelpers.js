// lib/fcmHelpers.js
import { getToken } from "firebase/messaging";

export const getTokenFromFCM = async (alreadyHaveToken, messaging) => {
  if (typeof navigator === "undefined" || !navigator.serviceWorker) {
    console.log("Service workers are not supported in this environment.");
    return { token: null, shouldUpdateToken: !!alreadyHaveToken }; // Return null and flag for token removal if service workers are not available
  }

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  try {
    // Request permission for notifications
    const permission = await Notification.requestPermission();

    // If permission is denied, return null and flag for token removal
    if (permission !== "granted") {
      console.log("Notification permission not granted.");
      return { token: null, shouldUpdateToken: !!alreadyHaveToken };
    }

    // Register service worker

    // Fetch new FCM token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    // Return the token and indicate if the token should be updated
    return {
      token,
      shouldUpdateToken: token !== alreadyHaveToken && permission === "granted", // Update if the token is new or different
    };
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return { token: null, shouldUpdateToken: !!alreadyHaveToken }; // Return null and flag for token removal if an error occurs
  }
};
