import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";

import Screams from "../../components/Screams/Screams";
import StaticProfile from "../../components/Profile/StaticProfile/StaticProfile";
import ProfileSkeleton from "../../components/Profile/ProfileSkeleton/ProfileSkeleton";
import ErrorSnackbar from "../../components/ErrorSnackbar/ErrorSnackbar";
import { getUserData, clearDataError } from "../../store/actions/data";

function User(props) {
  const { match } = props;
  const {
    params: { userName },
  } = match;
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.data.userData);
  const loadingUser = useSelector((state) => state.data.loading.getUserData);

  console.log("rending User");

  useEffect(() => {
    dispatch(getUserData(userName));
  }, [dispatch, userName]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      dispatch(clearDataError(null, { screams: true }));
    };
  }, [dispatch]);

  const staticProfileMarkup =
    loadingUser || !userData ? (
      <ProfileSkeleton />
    ) : (
      <StaticProfile profile={userData} />
    );
  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          <Screams userName={userName} loadingUser={loadingUser} />
        </Grid>
        <Grid item sm={4} xs={12}>
          {staticProfileMarkup}
        </Grid>
      </Grid>
      <ErrorSnackbar />
    </Fragment>
  );
}

export default User;
