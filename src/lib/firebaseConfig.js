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

let messaging;

if (typeof window !== "undefined") {
  // Check if Firebase Messaging is supported in the browser
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
    }
  });
} else {
  console.warn("Firebase Messaging is not supported in server-side rendering.");
}

export { messaging };
