import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";

import TooltipButton from "../TooltipButton/TooltipButton";
import DeleteScream from "./DeleteScream/DeleteScream";
import ScreamDetail from "./ScreamDetail/ScreamDetail";
import LikeButton from "../LikeButton/LikeButton";

const useStyles = makeStyles((theme) => ({
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
}));

function Scream(props, ref) {
  dayjs.extend(relativeTime);
  const classes = useStyles();
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
    },
  } = props;

  const deleteButton = <DeleteScream screamId={screamId} userName={userName} />;

  console.log(`rendering ${screamId}`);
  return (
    <Card className={classes.card} ref={ref ? ref : null}>
      <CardMedia
        image={userImage}
        title="Profile image"
        className={classes.image}
      />
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          component={Link}
          to={`/users/${userName}`}
          color="primary"
        >
          {userName}
        </Typography>
        {deleteButton}
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        <LikeButton screamId={screamId} />
        <span>{likeCount} Likes</span>
        {matches && <br />}
        <TooltipButton title="comment">
          <ChatIcon color="primary" />
        </TooltipButton>
        <span>{commentCount} comments</span>
        <ScreamDetail screamId={screamId} openDialog={props.openDialog} />
      </CardContent>
    </Card>
  );
}

export default React.forwardRef(Scream);
