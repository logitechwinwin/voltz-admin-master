"use client";
import { SearchBox } from "@/component";
import { SocketContext } from "@/context/socketReducer";
import { ApiManager } from "@/helpers";
import { Box, Container, Grid, Stack, useMediaQuery } from "@mui/material";
import debounce from "lodash/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatBox from "./ChatBox";
import ChatDrawer from "./ChatDrawer";
import UserList from "./UserList";

const Chats = () => {
  const { user } = useSelector((state) => state.appReducer);
  const matches = useMediaQuery("(min-width:900px)");
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const chatId = params.get("chatId");
  const {
    state: { socket },
  } = useContext(SocketContext);
  const chatContainerRef = useRef(null);

  const [userChat, setUserChat] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [sendMsgLoading, setSendMsgLoading] = useState(false);
  const [hasMoreChat, setHasMoreChat] = useState(true);
  const [messages, setMessages] = useState({ items: [] });
  const [openDrawer, setOpenDrawer] = useState(false);

  const activeChatRef = useRef(activeChat);

  const recipient = useMemo(() => activeChat?.participants?.find((p) => p?.user?.id !== user?.id)?.user, [activeChat, user]);

  const fetchAllChats = useCallback(
    async (search = "") => {
      try {
        const { data } = await ApiManager({ path: `chat?search=${search}` });
        setUserChat(data?.response?.details || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setChatLoading(false);
      }
    },
    [user?.id]
  );

  const fetchChatMessages = async (scroll, chatId, lastMessageId) => {
    setLoading(true);
    try {
      const path = `chat/messages?chatId=${chatId}&limit=10${lastMessageId ? `&lastMessageId=${lastMessageId}` : ""}`;
      const { data } = await ApiManager({ path });

      setMessages((prev) =>
        scroll ? { ...data?.response?.details, items: [...prev.items, ...data?.response?.details.items] } : data?.response?.details
      );

      if (!data?.response?.details?.items) {
        setHasMoreChat(false);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMsg = useCallback(
    async (msg) => {
      setSendMsgLoading(true);
      try {
        const { data } = await ApiManager({
          path: "chat/send-message",
          method: "post",
          params: { content: msg, recipientId: recipient?.id },
        });

        const { message, chat } = data?.response?.details;

        setUserChat((prev) => prev.map((each) => (each.id === chat.id ? { ...chat, unreadCount: 0 } : each)));
        setMessages((prev) => ({ ...prev, items: [message, ...prev.items] }));
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setSendMsgLoading(false);
      }
    },
    [recipient?.id]
  );

  const scrollToBottom = (delay = 50) => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, delay);
    }
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  useEffect(() => {
    if (userChat.length && chatId && !activeChat) {
      setActiveChat(userChat.find((eachChat) => eachChat.id === Number(chatId)));
      fetchChatMessages(false, chatId);
    }
  }, [chatId, userChat]);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    const handleMessage = (data) => {
      const { chat, message, sendChatToRecipient } = data;

      setUserChat((prev) =>
        sendChatToRecipient
          ? [chat, ...prev]
          : prev.map((each) => (each.id === chat.id ? (activeChatRef.current?.id === chat.id ? { ...chat, unreadCount: 0 } : chat) : each))
      );

      if (activeChatRef.current?.id === chat.id) {
        socket.emit("onMessageMarkAsRead", { chatId: chat?.id });
        setMessages((prev) => ({ ...prev, items: [message, ...prev.items] }));
        scrollToBottom();
      }
    };

    const handleMessageRead = () => {
      setMessages((prev) => ({
        ...prev,
        items: prev.items.map((each) => ({ ...each, status: "read" })),
      }));
    };

    socket?.on("onMessage", handleMessage);
    socket?.on("onMessageRead", handleMessageRead);

    return () => {
      socket?.off("onMessage", handleMessage);
      socket?.off("onMessageRead", handleMessageRead);
    };
  }, []);

  useEffect(() => {
    if (activeChatRef.current?.id) {
      socket.emit("onChatJoin", { chatId: activeChatRef.current?.id });
      socket.emit("onMessageMarkAsRead", { chatId: activeChatRef.current?.id });
      setUserChat((prev) => prev.map((each) => (each.id === activeChatRef.current?.id ? { ...each, unreadCount: 0 } : each)));
    }

    return () => {
      if (activeChatRef.current?.id) {
        socket.emit("onChatLeave", { chatId: activeChatRef.current?.id });
      }
    };
  }, [activeChat]);

  useEffect(() => {
    if (navigator?.serviceWorker) {
      const handleMessage = debounce((event) => {
        if (event.data?.type === "NEW_NOTIFICATION") {
          const newChatId = Number(event.data.chatId);
          if (activeChatRef.current?.id === newChatId) return;

          const newActiveChat = userChat.find((eachChat) => eachChat.id === newChatId);
          setActiveChat(newActiveChat);
          setMessages({ items: [] });
          fetchChatMessages(false, newChatId);
          router.push(`${pathname}?chatId=${newChatId}`);
        }
      }, 300);

      navigator.serviceWorker.addEventListener("message", handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    }
  }, [userChat, router, pathname, fetchChatMessages]);

  const searchChats = debounce((e) => fetchAllChats(e), 300);

  const renderUserChats = () => (
    <Stack sx={{ height: 1, width: 1 }} spacing={1}>
      <Box sx={{ height: { md: "calc(100% - 90%)" }, width: 1 }}>
        <SearchBox setSearch={searchChats} />
      </Box>
      <UserList
        userChat={userChat}
        setActiveChat={(chat) => {
          setActiveChat(chat);
          router.push(`${pathname}?chatId=${chat.id}`);
          setMessages({ items: [] });
          fetchChatMessages(false, chat.id);
          setOpenDrawer(false);
        }}
        loading={chatLoading}
        activeChat={activeChat}
      />
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ height: "calc(100vh - 85px)", padding: { xs: "auto", xs: "0 !important" } }}>
      <Box sx={{ height: "100%", py: 3 }}>
        <Grid container columnSpacing={2} sx={{ height: 1 }}>
          {matches ? (
            <Grid container direction={"row"} item md={5} sx={{ height: 1 }}>
              {renderUserChats()}
            </Grid>
          ) : (
            <ChatDrawer open={openDrawer} onRequestClose={() => setOpenDrawer(false)}>
              {renderUserChats()}
            </ChatDrawer>
          )}
          <Grid item md={7} xs={12} sx={{ height: 1 }}>
            <ChatBox
              hasMoreChat={hasMoreChat}
              messages={messages.items}
              ref={chatContainerRef}
              handleScroll={() => fetchChatMessages(true, activeChat.id, messages?.meta?.nextCursor)}
              activeChat={activeChat}
              loading={loading}
              handleSendMsg={handleSendMsg}
              recipient={recipient}
              sendMsgLoading={sendMsgLoading}
              chat={activeChat}
              handleOpenDrawer={() => setOpenDrawer(true)}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Chats;
