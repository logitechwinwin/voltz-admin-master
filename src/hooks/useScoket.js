import { BASE_API_URL } from "@/global";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const socketRef = useRef();

  useEffect(() => {
    const socketInstance = io(BASE_API_URL, {
      extraHeaders: {
        accessToken: localStorage.getItem(process.env.NEXT_PUBLIC_APP_TOKEN),
        "ngrok-skip-browser-warning": true,
      },
    });

    socketRef.current = socketInstance;

    if (socketInstance.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("user connected");
    }

    function onDisconnect() {
      console.log("user disconnected");
    }

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
    };
  }, []);

  return { socket: socketRef.current };
};

export default useSocket;
