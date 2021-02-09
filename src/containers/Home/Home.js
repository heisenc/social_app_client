import React, { Fragment, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// MUI stuff
import Grid from "@material-ui/core/Grid";

import Scream from "../../components/Scream/Scream";
import Profile from "../../components/Profile/Profile";
import ScreamSkeleton from "../../components/Scream/ScreamSkeleton/ScreamSkeleton";

import ErrorSnackbar from "../../components/ErrorSnackbar/ErrorSnackbar";
import { getScreams } from "../../store/actions/data";
import { clearDataError } from "../../store/actions/data";

function Home() {
  const screams = useSelector((state) => state.data.screams);
  const screamsData = screams.map((scream) => scream.data);
  const loading = useSelector((state) => state.data.loading.screams);
  const hasNextPage = useSelector((state) => state.data.hasNextPage);
  const lastCreatedAt =
    screamsData.length && screamsData[screamsData.length - 1].createdAt;

  const dispatch = useDispatch();

  const observer = useRef();
  const lastScreamRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          console.log(entries);
          if (entries[0].isIntersecting && hasNextPage) {
            dispatch(getScreams(lastCreatedAt));
            console.log("Visible");
          }
        },
        { threshold: 1 }
      );
      if (node) {
        console.log(node);
        observer.current.observe(node);
      }
    },
    [dispatch, loading, hasNextPage, lastCreatedAt]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getScreams());
    return () => {
      dispatch(clearDataError());
    };
  }, [dispatch]);

  console.dir(screamsData);

  const screamsMarkup = screamsData.map((screamData, index) =>
    index === screamsData.length - 1 ? (
      <Scream
        scream={screamData}
        key={screamData.screamId}
        ref={lastScreamRef}
      />
    ) : (
      <Scream scream={screamData} key={screamData.screamId} />
    )
  );

  let recentScreamMarkup = !loading ? (
    screamsMarkup
  ) : screamsData.length === 0 ? (
    <ScreamSkeleton />
  ) : (
    <Fragment>
      {screamsMarkup}
      <div>Loading...</div>
    </Fragment>
  );

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentScreamMarkup}
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
