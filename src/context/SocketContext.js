import { BASE_API_URL } from "@/global";
import { useReducer } from "react";
import { io } from "socket.io-client";
import { SOCKET_ACTIONS, SocketContext, initialState, socketReducer } from "./socketReducer"; // Assuming the reducer is in this path

export const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);

  // Function to connect the socket
  const connectSocket = () => {
    const socket = io(BASE_API_URL, {
      extraHeaders: {
        accessToken: localStorage?.getItem(process.env.NEXT_PUBLIC_APP_TOKEN),
        "ngrok-skip-browser-warning": true,
      },
    });

    dispatch({ type: SOCKET_ACTIONS.CONNECT, payload: socket });
  };

  // Function to disconnect the socket
  const disconnectSocket = () => {
    dispatch({ type: SOCKET_ACTIONS.DISCONNECT });
  };

  // Function to reset the socket
  const resetSocket = () => {
    dispatch({ type: SOCKET_ACTIONS.RESET });
  };

  return <SocketContext.Provider value={{ state, connectSocket, disconnectSocket, resetSocket }}>{children}</SocketContext.Provider>;
};
