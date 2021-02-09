import React, { Fragment, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";

import Scream from "../../components/Scream/Scream";
import StaticProfile from "../../components/Profile/StaticProfile/StaticProfile";
import ScreamSkeleton from "../../components/Scream/ScreamSkeleton/ScreamSkeleton";
import ProfileSkeleton from "../../components/Profile/ProfileSkeleton/ProfileSkeleton";
import ErrorSnackbar from "../../components/ErrorSnackbar/ErrorSnackbar";
import { getUserData, clearDataError } from "../../store/actions/data";

function User(props) {
  const { match } = props;
  const {
    params: { screamId: screamIdParam, userName },
  } = match;
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.data.userData);
  const loadingUser = useSelector((state) => state.data.loading.getUserData);
  const loadingScreams = useSelector((state) => state.data.loading.screams);
  const screams = useSelector((state) => state.data.screams);
  const screamsData = screams.map((scream) => scream.data);

  console.log("rending User");

  // scroll to the matched scream
  const notiScreamRef = useCallback(
    (node) => {
      console.log(node);
      if (node) {
        node.scrollIntoView();
      }
    },
    [match]
  );

  useEffect(() => {
    dispatch(getUserData(userName));
  }, [dispatch, userName]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      dispatch(clearDataError());
    };
  }, [dispatch]);

  const screamsMarkup = loadingScreams ? (
    <ScreamSkeleton />
  ) : !screamsData.length ? (
    <p>No screams from this user</p>
  ) : !screamIdParam ? (
    screamsData.map((screamData) => (
      <Scream scream={screamData} key={screamData.screamId} />
    ))
  ) : (
    screamsData.map((screamData) => {
      if (screamData.screamId !== screamIdParam) {
        return <Scream scream={screamData} key={screamData.screamId} />;
      }
      return (
        <Scream
          scream={screamData}
          key={screamData.screamId}
          ref={notiScreamRef}
          openDialog
        />
      );
    })
  );

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
          {screamsMarkup}
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
