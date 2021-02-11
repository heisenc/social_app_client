import React, { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";

// MUI stuff
import Grid from "@material-ui/core/Grid";

import Screams from "../../components/Screams/Screams";
import Profile from "../../components/Profile/Profile";

import ErrorSnackbar from "../../components/ErrorSnackbar/ErrorSnackbar";
import { getScreams } from "../../store/actions/data";
import { clearDataError } from "../../store/actions/data";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getScreams());
    return () => {
      dispatch(clearDataError());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          <Screams />
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
      <ErrorSnackbar />
    </Fragment>
  );
}

export default Home;
