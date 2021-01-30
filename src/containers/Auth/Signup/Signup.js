import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import AppIcon from "../../../images/monkey-icon.png";
import {
  checkFormValidity,
  inputChangeUpdateForm,
} from "../../../util/form-validation";
import { auth } from "../../../store/actions/user";
import { clearUserError } from "../../../store/actions/user";

const useStyles = makeStyles((theme) => {
  return {
    ...theme.globalStyle,
  };
});

function Signup(props) {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { history } = props;
  const classes = useStyles();
  const [signupForm, setSignupForm] = useState({
    email: {
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
      errorMessage: null,
    },
    password: {
      value: "",
      validation: {
        required: true,
        minLength: 5,
      },
      valid: false,
      touched: false,
      errorMessage: null,
      showPassword: false,
    },
    confirmPassword: {
      value: "",
      validation: {
        required: true,
        minLength: 5,
      },
      valid: false,
      touched: false,
      errorMessage: null,
      showPassword: false,
    },
    userName: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      errorMessage: null,
    },
  });
  const [isFormVaild, setIsFormVaild] = useState(false);
  const loginHandler = useCallback(
    (event) => {
      event.preventDefault();
      const signupData = {
        email: signupForm.email.value,
        password: signupForm.password.value,
        confirmPassword: signupForm.confirmPassword.value,
        userName: signupForm.userName.value,
      };
      dispatch(auth(signupData, history, true));
    },
    [history, signupForm, dispatch]
  );
  const inputChangedHandler = useCallback((event) => {
    setSignupForm((prevForm) => {
      const { name: fieldName, value } = event.target;
      const updatedForm = inputChangeUpdateForm(prevForm, fieldName, value);

      if (
        (fieldName === "confirmPassword" || fieldName === "password") &&
        updatedForm.confirmPassword.touched
      ) {
        updatedForm.confirmPassword.valid =
          updatedForm.confirmPassword.value === updatedForm.password.value;
        updatedForm.confirmPassword.errorMessage =
          updatedForm.confirmPassword.valid || "password mistmatch";
      }

      setIsFormVaild(checkFormValidity(updatedForm));
      return updatedForm;
    });
  }, []);

  const updateShowPassword = useCallback((fieldName) => {
    setSignupForm((prevForm) => {
      return {
        ...prevForm,
        [fieldName]: {
          ...prevForm[fieldName],
          showPassword: !prevForm[fieldName].showPassword,
        },
      };
    });
  }, []);

  const handleClickShowPassword = useCallback(
    (event) => {
      updateShowPassword("password");
    },
    [updateShowPassword]
  );

  const handleClickShowConfirmPassword = useCallback(
    (event) => {
      updateShowPassword("confirmPassword");
    },
    [updateShowPassword]
  );

  useEffect(() => {
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch]);

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt="monkry" className={classes.image} />
        <Typography variant="h2" className={classes.pageTitle}>
          Signup
        </Typography>
        <form noValidate onSubmit={loginHandler}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={signupForm.email.value}
            helperText={
              signupForm.email.valid || !signupForm.email.touched
                ? null
                : signupForm.email.errorMessage
            }
            error={!signupForm.email.valid && signupForm.email.touched}
            onChange={inputChangedHandler}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type={signupForm.password.showPassword ? "text" : "password"}
            label="Password"
            className={classes.textField}
            value={signupForm.password.value}
            helperText={
              signupForm.password.valid || !signupForm.password.touched
                ? null
                : signupForm.password.errorMessage
            }
            error={!signupForm.password.valid && signupForm.password.touched}
            onChange={inputChangedHandler}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {signupForm.password.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type={signupForm.confirmPassword.showPassword ? "text" : "password"}
            label="Confirm Password"
            className={classes.textField}
            value={signupForm.confirmPassword.value}
            helperText={
              signupForm.confirmPassword.valid ||
              !signupForm.confirmPassword.touched
                ? null
                : signupForm.confirmPassword.errorMessage
            }
            error={
              !signupForm.confirmPassword.valid &&
              signupForm.confirmPassword.touched
            }
            onChange={inputChangedHandler}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                  >
                    {signupForm.confirmPassword.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id="userName"
            name="userName"
            type="userName"
            label="User Name"
            className={classes.textField}
            value={signupForm.userName.value}
            helperText={
              signupForm.userName.valid || !signupForm.userName.touched
                ? null
                : signupForm.userName.errorMessage
            }
            error={!signupForm.userName.valid && signupForm.userName.touched}
            onChange={inputChangedHandler}
            fullWidth
          />

          {userState.error && (
            <Typography variant="body2" className={classes.customError}>
              {userState.error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={userState.loading || !isFormVaild}
          >
            Signup
            {userState.loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            Already have an accounts? login <Link to={"/login"}>here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

export default Signup;
