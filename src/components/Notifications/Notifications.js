import React, { useState, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//MUI stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

//Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { initMarkNotificationsRead } from "../../store/actions/user";

function Notifications(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const notifications = useSelector((state) => state.user.notifications);
  dayjs.extend(relativeTime);
  let notificationIcon;
  let unreadNotifications;
  if (notifications.length) {
    unreadNotifications = notifications.filter((noti) => !noti.read);
    notificationIcon = unreadNotifications.length ? (
      <Badge badgeContent={unreadNotifications.length} color="secondary">
        <NotificationsIcon />
      </Badge>
    ) : (
      <NotificationsIcon />
    );
  } else {
    notificationIcon = <NotificationsIcon />;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMenuOpened = () => {
    const unreadNotificationIds = unreadNotifications.map(
      (noti) => noti.notificationId
    );
    if (unreadNotificationIds.length) {
      dispatch(initMarkNotificationsRead(unreadNotificationIds));
    }
  };

  const onMenuItemClick = (path) => {
    history.push(path);
    handleClose();
  };

  let notificationMarkup = notifications.length ? (
    notifications.map((noti) => {
      const verb =
        noti.type === "LIKE_SCREAM" || noti.type === "LIKE_COMMENT"
          ? "liked"
          : "commented on";
      const time = dayjs(noti.createdAt).fromNow();
      const iconColor = noti.read ? "primary" : "secondary";
      const icon =
        noti.type === "LIKE_SCREAM" || noti.type === "LIKE_COMMENT" ? (
          <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
        ) : (
          <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
        );
      const obj = noti.type === "LIKE_COMMENT" ? "comment" : "scream";
      return (
        <MenuItem
          key={noti.notificationId}
          onClick={onMenuItemClick.bind(
            null,
            `/users/${noti.recipient}/scream/${noti.screamId}`
          )}
        >
          {icon}
          <Typography variant="body1">
            {noti.sender} {verb} your {obj} {time}
          </Typography>
        </MenuItem>
      );
    })
  ) : (
    <MenuItem onClick={handleClose}>You have no notifications yet</MenuItem>
  );

  return (
    <Fragment>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          {notificationIcon}
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onEntered={onMenuOpened}
      >
        {notificationMarkup}
      </Menu>
    </Fragment>
  );
}

export default Notifications;
