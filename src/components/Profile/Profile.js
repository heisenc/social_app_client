import React, { Fragment, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

// Icons
import LinkIcon from "@material-ui/icons/Link";
import LocationOn from "@material-ui/icons/LocationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

import EditDialog from "../EditDialog/EditDialog";
import TooltipButton from "../TooltipButton/TooltipButton";
import ProfileSkeleton from "./ProfileSkeleton/ProfileSkeleton";
import { uploadImage, authLogout } from "../../store/actions/user";

const useStyles = makeStyles((theme) => ({
  ...theme.globalStyle,
}));

function Profile(props) {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const imageInputRef = useRef(null);

  const { loading, authenticated } = userState;

  const imageChangeHandler = useCallback(
    (event) => {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image, image.name);
      dispatch(uploadImage(formData));
    },
    [dispatch]
  );

  const imageChangeTrigger = useCallback(
    (event) => {
      imageInputRef.current.click();
    },
    [imageInputRef]
  );

  const logoutHandler = useCallback(
    (event) => {
      dispatch(authLogout());
    },
    [dispatch]
  );

  let profile = (
    <Paper className={classes.paper}>
      <Typography variant="body2" align="center">
        No profile found, please login
      </Typography>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/signup"
        >
          Signup
        </Button>
      </div>
    </Paper>
  );

  if (authenticated) {
    const {
      credentials: { imageUrl, location, bio, userName, website, createdAt },
    } = userState;
    profile = (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image" />
            <input
              type="file"
              id="imageInput"
              hidden="hidden"
              onChange={imageChangeHandler}
              ref={imageInputRef}
            />
            <TooltipButton
              title="Edit profile picture"
              onClick={imageChangeTrigger}
              btnClassName="button"
            >
              <EditIcon color="primary" />
            </TooltipButton>
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              color="primary"
              variant="h5"
              to={`/users/${userName}`}
            >
              @{userName}
            </MuiLink>
            <hr />
            {bio && <Typography variant="body2"> {bio} </Typography>}
            <hr />
            {location && (
              <Fragment>
                <LocationOn color="primary" /> <span>{location}</span>
                <hr />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {" "}
                  {website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />
            <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
          <TooltipButton title="Logout" onClick={logoutHandler}>
            <KeyboardReturn color="primary" />
          </TooltipButton>
          <EditDialog />
        </div>
      </Paper>
    );
  } else if (loading) {
    profile = <ProfileSkeleton />;
  }

  return profile;
}

export default Profile;
