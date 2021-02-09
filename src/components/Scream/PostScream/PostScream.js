import React, { Fragment, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

//material UI stuff
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

//Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ImageIcon from "@material-ui/icons/Image";

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
  image: {
    value: "",
    validation: {},
    valid: true,
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
    previewImage: {
      width: "50%",
      margin: "auto auto",
      display: "block",
    },
  };
});

function PostScream() {
  const history = useHistory();
  const [screamData, setScreamData] = useState(initialScreamData);
  const [isOpen, setIsOpen] = useState(false);
  const [isScreamVaild, setIsScreamVaild] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const loading = useSelector((state) => state.data.loading.postScream);
  const error = useSelector((state) =>
    state.data.errors.find((err) => err.type === "POST_SCREAM")
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  const openDialogHandler = useCallback(() => {
    if (!error) {
      setScreamData(initialScreamData);
      setIsScreamVaild(false);
      setImagePreview(null);
    }
    setIsOpen(true);
  }, [error]);

  const closeDialogHandler = useCallback(() => {
    setIsOpen(false);
  }, []);

  const inputChangeHandler = useCallback((event) => {
    let { name: fieldName, value, files } = event.target;
    if (files && files[0]) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = (e) => {
        setImagePreview(e.target.result);
      };
    }
    setScreamData((prevForm) => {
      value = files && files[0] ? files[0] : value;
      const updatedForm = inputChangeUpdateForm(prevForm, fieldName, value);
      setIsScreamVaild(checkFormValidity(updatedForm));
      return updatedForm;
    });
  }, []);

  const postScreamHandler = useCallback(
    (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("body", screamData.body.value);
      formData.append("image", screamData.image.value);
      dispatch(initPostScream(formData));
      closeDialogHandler();
      history.push("/");
      window.scroll(0, 0);
    },
    [dispatch, screamData, closeDialogHandler, history]
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
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className={classes.previewImage}
              />
            )}
            <br />
            <input
              name="image"
              accept="image/*"
              id="raised-button-file"
              multiple
              type="file"
              onChange={inputChangeHandler}
              hidden
            />
            <Tooltip title="upload image" placement="top">
              <label htmlFor="raised-button-file">
                <IconButton component="span" className="button">
                  <ImageIcon />
                </IconButton>
              </label>
            </Tooltip>
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
