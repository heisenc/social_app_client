import React, { Fragment, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//material UI stuff
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

//Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import TooltipButton from "../../TooltipButton/TooltipButton";
import {
  checkFormValidity,
  inputChangeUpdateForm,
} from "../../../util/form-validation";
import { initPostScream } from "../../../store/actions/data";

const initialScreamData = {
  body: {
    value: "",
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    errorMessage: null,
  },
};

const useStyles = makeStyles((theme) => {
  return {
    ...theme.globalStyle,
    submitButton: {
      position: "relative",
      float: "right",
      marginTop: 10,
    },
    progressSpinner: {
      position: "absolute",
    },
    closeButton: {
      position: "absolute",
      left: "91%",
      top: "6%",
    },
  };
});

function PostScream() {
  const [screamData, setScreamData] = useState(initialScreamData);
  const [isOpen, setIsOpen] = useState(false);
  const [isScreamVaild, setIsScreamVaild] = useState(false);
  const loading = useSelector((state) => state.data.loading.postScream);
  const error = useSelector((state) =>
    state.data.errors.find((err) => err.type === "POST_SCREAM")
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  const openDialogHandler = useCallback(() => {
    if (!error) {
      setScreamData(initialScreamData);
    }
    setIsOpen(true);
  }, [error]);

  const closeDialogHandler = useCallback(() => {
    setIsOpen(false);
  }, []);

  const inputChangeHandler = useCallback((event) => {
    setScreamData((prevForm) => {
      const { name: fieldName, value } = event.target;
      const updatedForm = inputChangeUpdateForm(prevForm, fieldName, value);
      setIsScreamVaild(checkFormValidity(updatedForm));
      return updatedForm;
    });
  }, []);

  const postScreamHandler = useCallback(
    (event) => {
      event.preventDefault();
      const scream = {
        body: screamData.body.value,
      };
      dispatch(initPostScream(scream));
      closeDialogHandler();
    },
    [dispatch, screamData, closeDialogHandler]
  );

  return (
    <Fragment>
      <TooltipButton title="Post a Scream!" onClick={openDialogHandler}>
        <AddIcon />
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
        <DialogTitle>Post a new scream</DialogTitle>
        <DialogContent>
          <form onSubmit={postScreamHandler}>
            <TextField
              name="body"
              type="text"
              label="SCREAM"
              multiline
              rows="3"
              placeholder="Scream at your fellow apes"
              value={screamData.body.value}
              error={!screamData.body.valid && screamData.body.touched}
              helperText={screamData.body.errorMessage}
              className={classes.textField}
              onChange={inputChangeHandler}
              fullWidth
            />
            {/* {error && (
              <Typography variant="body2" className={classes.customError}>
                {error}
              </Typography>
            )} */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading || !isScreamVaild}
            >
              submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default PostScream;
