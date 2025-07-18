// lib/firebaseConfig.js
"use client";

import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDeWo4f3YP31a8MrATI1AOmM-khrjfs9E4",
  authDomain: "voltz-8a2c5.firebaseapp.com",
  projectId: "voltz-8a2c5",
  storageBucket: "voltz-8a2c5.appspot.com",
  messagingSenderId: "928492200732",
  appId: "1:928492200732:web:45830c58f64e075b31d0d9",
  measurementId: "G-FHBCZ5L4G0",
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Lazy initialization of messaging
let messagingInstance = null;

export const getMessagingInstance = async () => {
  if (messagingInstance) {
    return messagingInstance;
  }

  // Only initialize on client side
  if (typeof window === "undefined") {
    // Suppress console warning in development for cleaner logs
    if (process.env.NODE_ENV === "development") {
      // This is expected during SSR, no need to log it
      return null;
    }
    return null;
  }

  try {
    const supported = await isSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }
  } catch (error) {
    console.warn("Failed to initialize Firebase Messaging:", error);
    return null;
  }
};

// For backward compatibility - returns null during SSR
export const messaging = null;
