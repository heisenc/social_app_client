import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { clearDataError } from "../../store/actions/data";

const useStyles = makeStyles({
  alert: {
    margin: 10,
  },
});

function ErrorSnackbar(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.data.errors);

  const handleClose = (errorType) => {
    dispatch(clearDataError(errorType));
  };

  useEffect(() => {
    let timer;
    if (errors.length) {
      timer = setTimeout(() => {
        dispatch(clearDataError());
      }, 6000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [dispatch, errors]);

  return (
    <Snackbar open={!!errors.length}>
      <div>
        {errors.map((err) => (
          <MuiAlert
            className={classes.alert}
            key={err.type}
            elevation={6}
            variant="filled"
            severity="error"
            onClose={handleClose.bind(null, err.type)}
          >
            {err.message}
          </MuiAlert>
        ))}
      </div>
    </Snackbar>
  );
}

export default ErrorSnackbar;
