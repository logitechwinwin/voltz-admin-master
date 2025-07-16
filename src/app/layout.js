/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable import/order */
"use client";
import { Provider } from "react-redux";

import { Inter } from "next/font/google";
import "./globals.css";

import { MuiThemeProvider } from "@/component";
import AppProvider from "@/hoc/AppProvider";
import store from "@/store/store";

import { SocketProvider } from "@/context/SocketContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { SnackbarProvider } from "notistack";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <Script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA89-etKIfiHgLKrSEuwCBTGKimI6a-_aQ&libraries=places"></Script>
      <AppRouterCacheProvider>
        <MuiThemeProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <SocketProvider>
              <Provider store={store}>
                <SnackbarProvider maxSnack={3}>
                  <body className={inter.className} style={{ height: "100vh" }}>
                    <AppProvider>{children}</AppProvider>
                  </body>
                </SnackbarProvider>
              </Provider>
            </SocketProvider>
          </LocalizationProvider>
        </MuiThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
