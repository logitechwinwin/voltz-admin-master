import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, useMediaQuery } from "@mui/material";
import moment from "moment";

const ChatHeader = ({ recipient, handleOpenDrawer }) => {
  const isLargeScreen = useMediaQuery("(min-width:900px)");

  const formatDate = (dateString) => {
    const date = moment(dateString);

    if (date.isSame(moment(), "day")) {
      return `Today, ${date.format("hh:mm a")}`;
    } else {
      return date.format("MMM DD, h:mm a");
    }
  };


  return (

    <Paper variant="outlined" sx={{ minHeight: "80px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <ListItem
      // secondaryAction={
      //   <IconButton edge="end" aria-label="delete">
      //     <MoreVertIcon sx={{ color: "#00676D" }} />
      //   </IconButton>
      // }
      >
        {!isLargeScreen && (
          <ListItemAvatar sx={{ minWidth: "40px" }}>
            <IconButton onClick={handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
          </ListItemAvatar>
        )}
        <ListItemAvatar sx={{ minWidth: { sm: 64 } }}>
          <Avatar
            alt={recipient ? (recipient?.activationStatus == "active" ? (recipient?.role != 'volunteer' ? recipient.name : `${recipient.firstName} ${recipient.lastName}`) : recipient?.role.toUpperCase()) : "Select a Chat"}
            src={recipient?.activationStatus === "active" && recipient?.profileImage}
            sx={{ width: { xs: 40, sm: 50, md: 54 }, height: { xs: 40, sm: 50, md: 54 } }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={recipient ? (recipient.activationStatus == "active" ? (recipient?.role !== 'volunteer' ? recipient.name : `${recipient.firstName} ${recipient.lastName}`) : recipient.role.toUpperCase() ) : "Select a Chat"}
          primaryTypographyProps={{
            noWrap: true,
            variant: "h6",
            fontWeight: "bold",
          }}
          secondary={recipient?.activationStatus === 'active' && recipient?.isOnline ? "online" : recipient?.lastOnline ? formatDate(recipient?.lastOnline) : ""}
        />
      </ListItem>
    </Paper>
  );
};

export default ChatHeader;
