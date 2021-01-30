import React, { Fragment, useCallback, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";

import {
  checkFormValidity,
  inputChangeUpdateForm,
} from "../../util/form-validation";
import { editUserDetail } from "../../store/actions/user";
import TooltipButton from "../TooltipButton/TooltipButton";

const useStyles = makeStyles((theme) => {
  return {
    ...theme.globalStyle,
    button: {
      float: "right",
    },
  };
});

function EditDialog(props) {
  const classes = useStyles();
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    credentials: { bio, location, website },
    loading,
  } = userState;

  const initialUserDetail = useMemo(
    () => ({
      bio: {
        value: bio || "",
        validation: {},
        valid: bio !== undefined,
        touched: false,
        errorMessage: null,
      },
      location: {
        value: location || "",
        validation: {},
        valid: location !== undefined,
        touched: false,
        errorMessage: null,
      },
      website: {
        value: website || "",
        validation: {},
        valid: website !== undefined,
        touched: false,
        errorMessage: null,
      },
    }),
    [bio, location, website]
  );
  const [userDetail, setUserDetail] = useState(initialUserDetail);

  const [isOpen, setIsOpen] = useState(false);
  const [isFormVaild, setIsFormVaild] = useState(false);

  const openDialogHandler = useCallback(() => {
    setUserDetail(initialUserDetail);
    setIsOpen(true);
  }, [initialUserDetail]);

  const closeDialogHandler = useCallback(() => {
    setIsOpen(false);
    setIsFormVaild(false);
  }, []);

  const inputChangeHandler = useCallback((event) => {
    setUserDetail((prevForm) => {
      const { name: fieldName, value } = event.target;
      const updatedForm = inputChangeUpdateForm(prevForm, fieldName, value);
      setIsFormVaild(checkFormValidity(updatedForm));
      return updatedForm;
    });
  }, []);

  const saveDetailsHandler = useCallback(() => {
    const userData = {
      bio: userDetail.bio.value,
      location: userDetail.location.value,
      website: userDetail.website.value,
    };
    dispatch(editUserDetail(userData));
    closeDialogHandler();
  }, [dispatch, userDetail, closeDialogHandler]);

  return (
    <Fragment>
      <TooltipButton
        title="Edit user details"
        onClick={openDialogHandler}
        btnClassName={classes.button}
      >
        <EditIcon color="primary" />
      </TooltipButton>
      <Dialog
        open={isOpen}
        onClose={closeDialogHandler}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Your details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              type="text"
              label="Bio"
              multiline
              row="3"
              placeholder="A short bio about yourself"
              className={classes.textField}
              value={userDetail.bio.value}
              onChange={inputChangeHandler}
              fullWidth
              error={!userDetail.bio.valid && userDetail.bio.touched}
              helperText={userDetail.bio.errorMessage}
            />{" "}
            <TextField
              name="website"
              type="text"
              label="Website"
              placeholder="Your personal website"
              className={classes.textField}
              value={userDetail.website.value}
              onChange={inputChangeHandler}
              fullWidth
              error={!userDetail.website.valid && userDetail.website.touched}
              helperText={userDetail.website.errorMessage}
            />{" "}
            <TextField
              name="location"
              type="text"
              label="Location"
              placeholder="Where you live"
              className={classes.textField}
              value={userDetail.location.value}
              onChange={inputChangeHandler}
              fullWidth
              error={!userDetail.location.valid && userDetail.location.touched}
              helperText={userDetail.location.errorMessage}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogHandler} color="primary">
            Cancel
          </Button>
          <Button
            onClick={saveDetailsHandler}
            color="primary"
            disabled={!isFormVaild || loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default EditDialog;
