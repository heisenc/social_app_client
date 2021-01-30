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
  console.log(theme);
  return {
    ...theme.globalStyle,
  };
});

function Login(props) {
  const { history } = props;
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loginForm, setLoginForm] = useState({
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
  });
  const [isFormVaild, setIsFormVaild] = useState(false);
  const loginHandler = useCallback(
    (event) => {
      event.preventDefault();
      const loginData = {
        email: loginForm.email.value,
        password: loginForm.password.value,
      };
      dispatch(auth(loginData, history, false));
    },
    [history, loginForm, dispatch]
  );
  const inputChangedHandler = useCallback((event) => {
    setLoginForm((prevForm) => {
      const { name: filedName, value } = event.target;
      const updatedForm = inputChangeUpdateForm(prevForm, filedName, value);
      setIsFormVaild(checkFormValidity(updatedForm));
      return updatedForm;
    });
  }, []);

  const handleClickShowPassword = useCallback((event) => {
    setLoginForm((prevForm) => {
      return {
        ...prevForm,
        password: {
          ...prevForm.password,
          showPassword: !prevForm.password.showPassword,
        },
      };
    });
  }, []);

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
          Login
        </Typography>
        <form noValidate onSubmit={loginHandler}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={loginForm.email.value}
            helperText={
              loginForm.email.valid || !loginForm.email.touched
                ? null
                : loginForm.email.errorMessage
            }
            error={!loginForm.email.valid && loginForm.email.touched}
            onChange={inputChangedHandler}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type={loginForm.password.showPassword ? "text" : "password"}
            label="Password"
            className={classes.textField}
            value={loginForm.password.value}
            helperText={
              loginForm.password.valid || !loginForm.password.touched
                ? null
                : loginForm.password.errorMessage
            }
            error={!loginForm.password.valid && loginForm.password.touched}
            onChange={inputChangedHandler}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {loginForm.password.showPassword ? (
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
            Login
            {userState.loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            don't have an accounts? sign up <Link to={"/signup"}>here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

export default Login;
