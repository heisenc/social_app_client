import React, { Fragment, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

import TooltipButton from "../../TooltipButton/TooltipButton";
import { initDeleteScream } from "../../../store/actions/data";

const useStyles = makeStyles({
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%",
  },
});

function DeleteScream(props) {
  const { screamId, userName } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const isDeleting = useSelector(
    (state) =>
      state.data.screams.find((scream) => scream.data.screamId === screamId)
        .uiStatus.deleting
  );
  const authenticated = useSelector((state) => state.user.authenticated);
  const authUserName = useSelector(
    (state) => state.user.credentials && state.user.credentials.userName
  );
  const [open, setOpen] = useState(false);

  const openDialogHandler = useCallback((event) => {
    setOpen(true);
  }, []);
  const closeDialogHandler = useCallback((event) => {
    setOpen(false);
  }, []);

  const deleteScream = useCallback(() => {
    dispatch(initDeleteScream(screamId));
    setOpen(false);
  }, [dispatch, screamId]);

  let deleteButton = null;
  if (authenticated && authUserName === userName) {
    deleteButton = (
      <Fragment>
        <TooltipButton
          title="Delete Scream"
          onClick={openDialogHandler}
          btnClassName={classes.deleteButton}
          disabled={isDeleting}
        >
          <DeleteOutline color="secondary" />
        </TooltipButton>
        <Dialog
          open={open}
          onClose={closeDialogHandler}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Are you sure you want to delete this scream ?
          </DialogTitle>
          <DialogActions>
            <Button onClick={closeDialogHandler} color="primary">
              Cancel
            </Button>
            <Button onClick={deleteScream} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }

  return deleteButton;
}

export default DeleteScream;
