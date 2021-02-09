import React from "react";
import { Link } from "react-router-dom";
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
import ScreamDetail from "./ScreamDetail/ScreamDetail";
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
  } = props;

  const deleteButton = <DeleteScream screamId={screamId} userName={userName} />;

  console.log(`rendering ${screamId}`);
  return (
    <Card className={classes.card} ref={ref ? ref : null}>
      <CardHeader
        avatar={
          <MuiLink component={Link} color="primary" to={`/users/${userName}`}>
            <Avatar alt={userName} src={userImage} />
          </MuiLink>
        }
        title={
          <MuiLink
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userName}`}
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
        {deleteButton}
        <Typography variant="body1">{body}</Typography>

        <ScreamDetail screamId={screamId} openDialog={props.openDialog} />
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
    </Card>
  );
}

export default React.forwardRef(Scream);
