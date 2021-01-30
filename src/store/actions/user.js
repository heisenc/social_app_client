import * as actionTypes from "./actionTypes";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const auth = (userData, history, isSignup) => async (dispatch) => {
  dispatch(setUserStart());
  try {
    const path = isSignup ? "/signup" : "/login";
    const loginRes = await axios.post(path, userData);
    console.log(loginRes.data);
    const FBIdToken = `Bearer ${loginRes.data.token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;

    const userRes = await axios.get("/user");
    dispatch(authSuccess(userRes.data));
    history.push("/");
  } catch (err) {
    console.log(err.response.data.message);
    dispatch(setUserFail(err.response.data.message));
  }
};

const setUserStart = () => {
  return {
    type: actionTypes.SET_USER_START,
  };
};

const setUserFail = (error) => {
  return {
    type: actionTypes.SET_USER_FAIL,
    error,
  };
};

const authSuccess = (userData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: { ...userData },
  };
};

export const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuth = () => async (dispatch) => {
  const FBIdToken = localStorage.getItem("FBIdToken");
  if (!FBIdToken) {
    return dispatch(authLogout());
  }
  const decodedToken = jwtDecode(FBIdToken.split("Bearer ")[1]);
  if (decodedToken.exp * 1000 < Date.now()) {
    return dispatch(authLogout());
  }

  dispatch(setUserStart());
  axios.defaults.headers.common["Authorization"] = FBIdToken;
  try {
    const userRes = await axios.get("/user");
    dispatch(authSuccess(userRes.data));
  } catch (err) {
    console.log(err.response.data.message);
    dispatch(setUserFail(err.response.data.message));
  }
};

export const uploadImage = (formdata) => async (dispatch) => {
  dispatch(setUserStart());
  try {
    const res = await axios.post("/user/image", formdata);
    const imageUrl = res.data.fileLocation;
    dispatch(uploadImageSuccess(imageUrl));
  } catch (err) {
    console.log(err.response.data.message);
    dispatch(setUserFail(err.response.data.message));
  }
};

const uploadImageSuccess = (imageUrl) => {
  return {
    type: actionTypes.UPLOAD_IMAGE_SUCCESS,
    imageUrl,
  };
};

export const editUserDetail = (userDetail) => async (dispatch) => {
  dispatch(setUserStart());
  try {
    const res = await axios.post("/user", userDetail);
    const updatedCredentials = res.data.updatedDetails;
    dispatch(editDetailSuccess(updatedCredentials));
  } catch (err) {
    console.log(err.response.data.message);
    dispatch(setUserFail(err.response.data.message));
  }
};

const editDetailSuccess = (updatedCredentials) => {
  return {
    type: actionTypes.EDIT_DETIAL_SUCCESS,
    credentials: updatedCredentials,
  };
};

export const initMarkNotificationsRead = (notificationIds) => async (
  dispatch
) => {
  try {
    await axios.post("/notifications", {
      notifications: notificationIds,
    });
    dispatch(markNotificationsRead());
  } catch (err) {
    console.log(err.response.data.message);
    dispatch(setUserFail(err.response.data.message));
  }
};

const markNotificationsRead = () => {
  return {
    type: actionTypes.MARK_NOTIFICATIONS_READ,
  };
};

export const clearUserError = () => {
  return {
    type: actionTypes.CLEAR_USER_ERROR,
  };
};
