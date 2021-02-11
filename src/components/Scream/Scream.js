import React, { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MuiLink from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";

import TooltipButton from "../TooltipButton/TooltipButton";
import DeleteScream from "./DeleteScream/DeleteScream";
import LikeButton from "../LikeButton/LikeButton";

const useStyles = makeStyles((theme) => ({
  card: {
    position: "relative",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    objectFit: "cover",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain",
  },
}));

function Scream(props, ref) {
  dayjs.extend(relativeTime);
  const classes = useStyles();
  const history = useHistory();
  const matches = useMediaQuery("(max-width:800px)");

  const {
    scream: {
      body,
      createdAt,
      userImage,
      userName,
      screamId,
      likeCount,
      commentCount,
      image,
    },
    deletable = true,
    expandable = true,
    children,
  } = props;

  const deleteButton = <DeleteScream screamId={screamId} userName={userName} />;

  console.log(`rendering ${screamId}`);

  const onUserLinkClickHandler = (event) => {
    event.stopPropagation();
  };

  const clickScreamHandler = useCallback(
    (event) => {
      console.log(event.target, event.currentTarget);
      history.push(`/users/${userName}/scream/${screamId}`, {
        fromScream: true,
      });
    },
    [userName, history, screamId]
  );

  return (
    <Card
      className={classes.card}
      ref={ref ? ref : null}
      onClick={expandable ? clickScreamHandler : null}
      style={expandable ? { cursor: "pointer" } : null}
    >
      <CardHeader
        avatar={
          <MuiLink
            component={Link}
            color="primary"
            to={`/users/${userName}`}
            onClick={onUserLinkClickHandler}
          >
            <Avatar alt={userName} src={userImage} />
          </MuiLink>
        }
        title={
          <MuiLink
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userName}`}
            onClick={onUserLinkClickHandler}
          >
            @{userName}
          </MuiLink>
        }
        subheader={dayjs(createdAt).fromNow()}
      />
      {image && (
        <CardMedia
          className={classes.media}
          image={image}
          title="scream iamge"
        />
      )}
      <CardContent className={classes.content}>
        {deletable && deleteButton}
        <Typography variant="body1">{body}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <LikeButton screamId={screamId} />
        <span>{likeCount} Likes</span>
        {matches && <br />}
        <TooltipButton title="comment">
          <ChatIcon color="primary" />
        </TooltipButton>
        <span>{commentCount} comments</span>
      </CardActions>
      {children}
    </Card>
  );
}

export default React.forwardRef(Scream);
