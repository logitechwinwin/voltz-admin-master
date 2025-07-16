import { createSlice } from "@reduxjs/toolkit";

export const reducer = createSlice({
  name: "appReducer",
  initialState: {
    user: null,
    isLogged: false,
    openMenu: false,
    walletBalance: 0,
    loader: false,
    toast: { message: "", open: false, type: "success" },
    deviceToken: null,
  },

  reducers: {
    setUser: (state, { payload }) => {
      state.isLogged = true;
      state.user = payload;
      state.walletBalance =
        payload.wallet?.balance ||
        payload?.campaignManagerCreatedBy?.wallet?.balance;
    },
    setLogged: (state) => {
      state.isLogged = true;
    },
    logoutUser: (state) => {
      // state.user = null;
      state.isLogged = false;
    },
    setWalletBalance: (state, { payload }) => {
      state.walletBalance = payload;
    },
    toggleMenu: (state) => {
      state.openMenu = !state.openMenu;
    },
    setToast: (state, { payload }) => {
      state.toast = { ...payload, open: true };
    },
    removeToast: (state, { payload }) => {
      state.toast = { open: false };
    },
    handleLoader: (state, { payload }) => {
      state.loader = payload;
    },
    setDeviceToken: (state, { payload }) => {
      state.deviceToken = payload;
    },
  },
});

export const {
  setLogged,
  setWalletBalance,
  setToast,
  setUser,
  logoutUser,
  handleLoader,
  removeToast,
  toggleMenu,
  setTheme,
  setDeviceToken,
} = reducer.actions;

export default reducer.reducer;
