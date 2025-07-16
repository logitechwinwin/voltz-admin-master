import { createContext, useReducer } from "react";
import { io } from "socket.io-client";
import { BASE_API_URL } from "@/global";

// Action types
export const SOCKET_ACTIONS = {
  CONNECT: "CONNECT",
  DISCONNECT: "DISCONNECT",
  RESET: "RESET",
};

// Reducer function to handle socket state
export const socketReducer = (state, action) => {
  switch (action.type) {
    case SOCKET_ACTIONS.CONNECT:
      return { ...state, socket: action.payload, connected: true };

    case SOCKET_ACTIONS.DISCONNECT:
      state.socket?.disconnect(); // Disconnect the current socket
      return { ...state, socket: null, connected: false };

    case SOCKET_ACTIONS.RESET:
      state.socket?.disconnect(); // Disconnect the current socket before resetting
      const newSocket = io(BASE_API_URL, {
        extraHeaders: {
          accessToken: localStorage?.getItem(process.env.NEXT_PUBLIC_APP_TOKEN),
          "ngrok-skip-browser-warning": true,
        },
      });
      return { ...state, socket: newSocket, connected: true };

    default:
      return state;
  }
};

// Initial state
export const initialState = {
  socket: null,
  connected: false,
};

// Create the SocketContext
export const SocketContext = createContext(null);
