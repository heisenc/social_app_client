import React, { Fragment, useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import TooltipButton from "../../TooltipButton/TooltipButton";
import { Link, useHistory, useLocation } from "react-router-dom";

//material UI stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";

import { getScream } from "../../../store/actions/data";
import LikeButton from "../../LikeButton/LikeButton";
import Comments from "../Comments/Comments";
import CommentForm from "../CommentForm/CommentForm";

const useStyles = makeStyles((theme) => {
  return {
    ...theme.globalStyle,
    profileImage: {
      width: 200,
      height: 200,
      borderRadius: "50%",
      objectFit: "cover",
    },
    screamImage: {
      width: 200,
      height: 200,
      objectFit: "contain",
    },
    dialogContent: {
      padding: 20,
    },
    closeButton: {
      position: "absolute",
      left: "90%",
    },
    expandButton: {
      position: "absolute",
      left: "90%",
    },
    spinnerDiv: {
      textAlign: "center",
      marginTop: 50,
      marginBottom: 50,
    },
  };
});

function ScreamDetail(props) {
  const classes = useStyles();
  const { screamId, openDialog } = props;
  const location = useLocation();

  console.log(`screamDetail screamId ${screamId}`, openDialog);
  const [isOpen, setIsOpen] = useState(false);
  const screamLoading = useSelector((state) => state.data.loading.scream);
  const scream = useSelector((state) => state.data.scream);
  let selectedScreamId,
    body,
    createdAt,
    userImage,
    userName,
    image,
    likeCount,
    commentCount;
  if (scream) {
    selectedScreamId = scream.screamId;
    body = scream.body;
    createdAt = scream.createdAt;
    userImage = scream.userImage;
    userName = scream.userName;
    likeCount = scream.likeCount;
    commentCount = scream.commentCount;
    image = scream.image;
  }

  const dispatch = useDispatch();
  const openDialogHandler = useCallback(() => {
    setIsOpen(true);
    dispatch(getScream(screamId));
  }, [dispatch, screamId]);

  const closeDialogHandler = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const oldPath = location.pathname;
    console.log(location.pathname, isOpen);
    console.log(selectedScreamId, screamId, userName, isOpen);
    if (selectedScreamId === screamId && isOpen) {
      const newPath = `/users/${userName}/scream/${screamId}`;
      window.history.pushState(null, null, newPath);
    }
    if (selectedScreamId === screamId && !isOpen) {
      if (
        location.pathname !== window.location.pathname &&
        location.pathname === "/"
      ) {
        window.history.pushState(null, null, location.pathname);
      } else if (location.pathname.startsWith(`/users/${userName}`)) {
        window.history.pushState(null, null, `/users/${userName}`);
      }
    }
  }, [selectedScreamId, screamId, userName, location, isOpen]);

  useEffect(() => {
    console.log("screamDetail useEffect ");

    if (openDialog) {
      openDialogHandler();
    }
  }, [location, openDialog, openDialogHandler]);

  const dialogMarkup =
    screamLoading || selectedScreamId !== screamId ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userName}`}
          >
            @{userName}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          {image && (
            <img alt="scream" src={image} className={classes.screamImage} />
          )}
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} likes</span>
          <TooltipButton title="comment">
            <ChatIcon color="primary" />
          </TooltipButton>
          <span>{commentCount} comments</span>
        </Grid>
        <hr className={classes.visibleSeparator} />
        <CommentForm screamId={screamId} />
        <Comments />
      </Grid>
    );
  return (
    <Fragment>
      <TooltipButton
        onClick={openDialogHandler}
        title="Expand scream"
        tipClassName={classes.expandButton}
      >
        <UnfoldMore color="primary" />
      </TooltipButton>
      <Dialog
        open={isOpen}
        onClose={closeDialogHandler}
        fullWidth
        maxWidth="sm"
      >
        <TooltipButton
          title="Close"
          onClick={closeDialogHandler}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </TooltipButton>
        <DialogContent className={classes.dialogContent}>
          {dialogMarkup}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ScreamDetail;
