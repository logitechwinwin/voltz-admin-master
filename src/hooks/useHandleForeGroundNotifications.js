import { SCREEN_TYPE } from "@/global";
import { getMessagingInstance } from "@/lib/firebaseConfig";
import { Close } from "@mui/icons-material";
import { Avatar, Card, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { onMessage } from "firebase/messaging";
import { usePathname, useRouter } from "next/navigation";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useEffect } from "react";

const useHandleForeGroundNotifications = () => {
  const path = usePathname();
  const router = useRouter();

  const handleNavigation = (notificationType, chatId, communityId, key) => {
    closeSnackbar(key);

    if (notificationType === SCREEN_TYPE.NEW_FOLLOWER) {
      return router.push("/ngo/profile");
    } else if (notificationType === SCREEN_TYPE.NEW_MESSAGE) {
      return router.push(`/ngo/chat?chatId=${chatId}`);
    } else if (notificationType === SCREEN_TYPE.NEW_MEMBER_JOIN_COMMUNITY) {
      return router.push(`/ngo/community/${communityId}`);
    }
  };

  useEffect(() => {
    const setupMessaging = async () => {
      const messaging = await getMessagingInstance();
      
      if (messaging) {
        onMessage(messaging, (payload) => {
          console.log('[Firebase] Received foreground message:', payload.data);
          const { title, body, icon, badge, image, notificationType, chatId, communityId } = payload.data;
          const notificationOptions = {
            body,
            icon: icon || "../src/assets/images/Logo.svg",
            badge: badge || "../src/assets/images/Logo.svg",
            data: { notificationType, chatId, communityId },
          };

          enqueueSnackbar({
            variant: "info", // You can use 'success', 'error', 'warning', or 'info'
            autoHideDuration: 5000,
            content: (key) => (
              <Card sx={{ borderRadius: "10px", maxWidth: "400px", borderLeft: 5, borderColor: (theme) => theme.palette.primary.main }} elevation={5}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => closeSnackbar(key)}>
                      <Close />
                    </IconButton>
                  }
                >
                  <ListItemButton borderRadius="10px" onClick={() => handleNavigation(notificationType, chatId, communityId, key)}>
                    <ListItemAvatar>
                      <Avatar src={notificationOptions.icon} alt="" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={title}
                      secondary={notificationOptions.body}
                      secondaryTypographyProps={{
                        noWrap: true,
                      }}
                      primaryTypographyProps={{
                        noWrap: true,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Card>
            ),
          });
        });
      }
    };

    setupMessaging();
  }, [path]); // Remove messaging from dependencies since we're getting it dynamically
};

export default useHandleForeGroundNotifications;
