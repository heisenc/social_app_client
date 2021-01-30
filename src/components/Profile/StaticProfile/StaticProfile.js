import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import { makeStyles } from "@material-ui/core/styles";
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

//Icons
import LinkIcon from "@material-ui/icons/Link";
import LocationOn from "@material-ui/icons/LocationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";

const useStyles = makeStyles((theme) => ({
  ...theme.globalStyle,
}));

function StaticProfile(props) {
  const {
    profile: { userName, createdAt, imageUrl, bio, website, location },
  } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imageUrl} alt="profile" className="profile-image" />
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
      </div>
    </Paper>
  );
}

export default StaticProfile;
