import React, { Fragment, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// material UI stuff
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";

// Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Scream from "../../components/Scream/Scream";
import TooltipButton from "../../components/TooltipButton/TooltipButton";
import ErrorSnackbar from "../../components/ErrorSnackbar/ErrorSnackbar";
import CommentForm from "../../components/Scream/CommentForm/CommentForm";
import Comments from "../../components/Scream/Comments/Comments";

import { clearDataError, getScream } from "../../store/actions/data";

const useStyles = makeStyles((theme) => {
  return {
    ...theme.globalStyle,
    spinnerDiv: {
      textAlign: "center",
      marginTop: 50,
      marginBottom: 50,
    },
  };
});

function ScreamDetail(props) {
  const classes = useStyles();
  const { match, history, location } = props;
  const dispatch = useDispatch();
  const scream = useSelector((state) => state.data.scream);
  const screamLoading = useSelector((state) => state.data.loading.scream);
  let selectedScreamId;
  if (scream) {
    selectedScreamId = scream.screamId;
  }

  const {
    params: { screamId: screamIdParam, userName },
  } = match;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getScream(screamIdParam));
    return () => {
      dispatch(clearDataError(null, { scream: true }));
    };
  }, [dispatch, screamIdParam]);

  const onBackBtnClickHander = useCallback(
    (event) => {
      if (
        location.state &&
        (location.state.fromScream || location.state.fromNotifications)
      ) {
        return history.goBack();
      }
      history.push(`/users/${userName}`);
    },
    [history, location, userName]
  );

  const screamDetailMarkup =
    screamLoading || selectedScreamId !== screamIdParam ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Scream scream={scream} deletable={false} expandable={false}>
        <hr className={classes.visibleSeparator} />
        <CardContent>
          <CommentForm screamId={selectedScreamId} />
          <Comments />
        </CardContent>
      </Scream>
    );

  return (
    <Fragment>
      <Grid container>
        <Grid item sm>
          <TooltipButton title="back" onClick={onBackBtnClickHander}>
            <ArrowBackIcon color="primary" />
          </TooltipButton>
        </Grid>
        <Grid item sm={10} xs={12}>
          {screamDetailMarkup}
        </Grid>
        <Grid item sm />
      </Grid>
      <ErrorSnackbar />
    </Fragment>
  );
}

export default ScreamDetail;
