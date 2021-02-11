import React, { useRef, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import Scream from "../Scream/Scream";
import ScreamSkeleton from "../Scream/ScreamSkeleton/ScreamSkeleton";
import { getScreams } from "../../store/actions/data";

function Screams(props) {
  const { userName, loadingUser } = props;
  const dispatch = useDispatch();
  const loadingScreams = useSelector((state) => state.data.loading.screams);
  const screams = useSelector((state) => state.data.screams);
  const screamsData = screams.map((scream) => scream.data);

  const hasNextPage = useSelector((state) => state.data.hasNextPage);
  const lastCreatedAt =
    screamsData.length && screamsData[screamsData.length - 1].createdAt;

  const observer = useRef();
  const lastScreamRef = useCallback(
    (node) => {
      if (loadingScreams) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          console.log(entries);
          if (entries[0].isIntersecting && hasNextPage) {
            if (userName) {
              dispatch(getScreams(lastCreatedAt, userName));
            } else {
              dispatch(getScreams(lastCreatedAt));
            }
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
    [dispatch, loadingScreams, hasNextPage, lastCreatedAt, userName]
  );

  const NoScreamsText = userName
    ? "No screams from this user"
    : "No screams. let start a new scream!";

  const screamsMarkup = !screamsData.length ? (
    <p>{NoScreamsText}</p>
  ) : (
    screamsData.map((screamData, index) =>
      index === screamsData.length - 1 ? (
        <Scream
          scream={screamData}
          key={screamData.screamId}
          ref={lastScreamRef}
        />
      ) : (
        <Scream scream={screamData} key={screamData.screamId} />
      )
    )
  );

  const recentScreamMarkup =
    !loadingScreams && ((userName && !loadingUser) || !userName) ? (
      screamsMarkup
    ) : screamsData.length === 0 ? (
      <ScreamSkeleton />
    ) : (
      <Fragment>
        {screamsMarkup}
        <div>Loading...</div>
      </Fragment>
    );
  return recentScreamMarkup;
}

export default Screams;
