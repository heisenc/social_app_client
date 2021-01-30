import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//material UI stuff
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { initPostComment } from "../../../store/actions/data";
import { checkFormValidity, inputChangeUpdateForm } from "../../../util/form-validation";

const initialCommentForm = {
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
  };
});

function CommentForm(props) {
  const { screamId } = props;
  const [commentForm, setCommentForm] = useState(initialCommentForm);
  const [isCommentFormVaild, setIsCommentFormVaild] = useState(false);
  const classes = useStyles();
  const loading = useSelector((state) => state.data.loading.postComment);
  // const error = useSelector((state) => state.data.error);
  const authenticated = useSelector((state) => state.user.authenticated);
  const dispatch = useDispatch();

  const postCommentHandler = useCallback(
    (event) => {
      event.preventDefault();
      const commentData = { body: commentForm.body.value };

      dispatch(initPostComment(screamId, commentData));
      setCommentForm(initialCommentForm);
    },
    [dispatch, commentForm, screamId]
  );

  const inputChangeHandler = useCallback((event) => {
    setCommentForm((prevForm) => {
      const { name: filedName, value } = event.target;
      const updatedForm = inputChangeUpdateForm(prevForm, filedName, value);
      setIsCommentFormVaild(checkFormValidity(updatedForm));
      return updatedForm;
    });
  }, []);

  const commentFormMarkup = authenticated ? (
    <Grid item xs={12} style={{ textAlign: "center" }}>
      <form onSubmit={postCommentHandler}>
        <TextField
          name="body"
          type="text"
          label="Comment on scream"
          error={!commentForm.body.valid && commentForm.body.touched}
          helperText={commentForm.body.errorMessage}
          value={commentForm.body.value}
          onChange={inputChangeHandler}
          fullWidth
          className={classes.textField}
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
          className={classes.button}
          disabled={loading || !isCommentFormVaild}
        >
          Submit
        </Button>
      </form>
      <hr className={classes.visibleSpearator} />
    </Grid>
  ) : null;

  return commentFormMarkup;
}

export default CommentForm;
