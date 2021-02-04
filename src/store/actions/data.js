import * as actionTypes from "./actionTypes";
import axios from "axios";

const setDataStart = (updateLoading, clearErrorType) => {
  return {
    type: actionTypes.SET_DATA_START,
    updateLoading,
    clearErrorType,
  };
};

const setDataFail = (error, updateLoading) => {
  return {
    type: actionTypes.SET_DATA_FAIL,
    error,
    updateLoading,
  };
};

export const getScreams = (lastCreatedAt) => async (dispatch) => {
  const updateLoading = { screams: true };
  dispatch(setDataStart(updateLoading, "GET_SCREAMS"));

  try {
    const url = lastCreatedAt
      ? `/screams?lastCreatedAt=${lastCreatedAt}&numPerPage=10`
      : `/screams?numPerPage=10`;
    const res = await axios.get(url);
    dispatch(
      setScreams(res.data.screams, res.data.hasNextPage, !lastCreatedAt)
    );
  } catch (error) {
    console.log(error);
    dispatch(
      setDataFail(
        { type: "GET_SCREAMS", message: error.response.data.message },
        { screams: false }
      )
    );
  }
};

const setScreams = (screamsData, hasNextPage, recent) => {
  return {
    type: actionTypes.SET_SCREAMS,
    screamsData,
    hasNextPage,
    recent,
  };
};

export const initLikeScream = (screamId) => async (dispatch) => {
  dispatch(changingLike(screamId, "LIKE_SCREAM"));
  try {
    const res = await axios.post(`/scream/${screamId}/like`);
    dispatch(likeScream(res.data.screamData, res.data.likeData));
  } catch (error) {
    console.log(error.response);
    const message =
      error.response.status === 401
        ? "Please login again"
        : error.response.data.message;
    dispatch(updateLikeFail(screamId, { type: "LIKE_SCREAM", message }));
  }
};

const changingLike = (screamId, clearErrorType) => {
  return {
    type: actionTypes.SET_CHANING_LIKE,
    screamId,
    clearErrorType,
  };
};

const updateLikeFail = (screamId, error) => {
  return {
    type: actionTypes.UPDATE_LIKE_FAIL,
    screamId,
    error,
  };
};

const likeScream = (screamData, likeData) => {
  return {
    type: actionTypes.LIKE_SCREAM,
    screamData,
    likeData,
  };
};

export const initUnlikeScream = (screamId) => async (dispatch) => {
  dispatch(changingLike(screamId, "UNLIKE_SCREAMS"));
  try {
    const res = await axios.post(`/scream/${screamId}/Unlike`);
    dispatch(unlikeScream(res.data.screamData));
  } catch (error) {
    console.log(error);
    const message =
      error.response.status === 401
        ? "Please login again"
        : error.response.data.message;
    dispatch(
      updateLikeFail(screamId, {
        type: "UNLIKE_SCREAMS",
        message,
      })
    );
  }
};

const unlikeScream = (screamData) => {
  return {
    type: actionTypes.UNLIKE_SCREAM,
    screamData,
  };
};

export const initDeleteScream = (screamId) => async (dispatch) => {
  dispatch(setDeletingScream(screamId));
  try {
    await axios.delete(`/scream/${screamId}`);
    dispatch(deleteScream(screamId));
  } catch (error) {
    console.log(error);
    const message =
      error.response.status === 401
        ? "Please login again"
        : error.response.data.message;
    dispatch(
      setDataFail({
        type: "DELETE_SCREAM",
        message,
      })
    );
  }
};

const deleteScream = (screamId) => {
  return {
    type: actionTypes.DELETE_SCREAM,
    screamId,
  };
};

const setDeletingScream = (screamId) => {
  return {
    type: actionTypes.SET_DELETING_SCREAM,
    screamId,
  };
};

export const initPostScream = (screamData) => async (dispatch) => {
  const updateLoading = { postScream: true };
  dispatch(setDataStart(updateLoading, "POST_SCREAM"));
  try {
    const res = await axios.post("/scream", screamData);
    console.log(res);
    dispatch(postScream(res.data));
    // const screamsRes = await axios.get("/screams");
    // dispatch(setScreams(screamsRes.data));
  } catch (error) {
    console.log(error);
    const message =
      error.response.status === 401
        ? "Please login again"
        : error.response.data.message;
    dispatch(
      setDataFail({ type: "POST_SCREAM", message }, { postScream: false })
    );
  }
};

const postScream = (newScreamData) => {
  return {
    type: actionTypes.POST_SCREAM,
    newScreamData,
  };
};

export const getScream = (screamId) => async (dispatch) => {
  const updateLoading = { scream: true };
  dispatch(setDataStart(updateLoading, "GET_SCREAM"));
  try {
    const res = await axios.get(`/scream/${screamId}`);
    dispatch(setScream(res.data));
  } catch (error) {
    console.log(error);
    dispatch(
      setDataFail(
        { type: "GET_SCREAM", message: error.response.data.message },
        { scream: false }
      )
    );
  }
};

export const setScream = (screamData) => {
  return {
    type: actionTypes.SET_SCREAM,
    screamData,
  };
};

export const initPostComment = (screamId, commentData) => async (dispatch) => {
  const updateLoading = { postComment: true };
  dispatch(setDataStart(updateLoading, "POST_COMMENT"));
  try {
    const res = await axios.post(`/scream/${screamId}/comment`, commentData);
    dispatch(postComment(res.data));
  } catch (error) {
    console.log(error);
    const message =
      error.response.status === 401
        ? "Please login again"
        : error.response.data.message;
    dispatch(
      setDataFail({ type: "POST_COMMENT", message }, { postComment: false })
    );
  }
};

export const postComment = (newCommentData) => {
  return {
    type: actionTypes.POST_COMMENT,
    newCommentData,
  };
};

export const getUserData = (userName) => async (dispatch) => {
  const updateLoading = { getUserData: true };
  dispatch(setDataStart(updateLoading, "GET_USER_DATA"));
  try {
    const res = await axios.get(`/user/${userName}`);
    dispatch(setUserData(res.data));
  } catch (error) {
    console.log(error);
    dispatch(
      setDataFail(
        { type: "GET_USER_DATA", message: error.response.data.message },
        { getUserData: false }
      )
    );
  }
};

const setUserData = (userData) => {
  return {
    type: actionTypes.SET_USER_DATA,
    userData,
  };
};

export const clearDataError = (clearErrorType) => {
  return {
    type: actionTypes.CLEAR_DATA_ERROR,
    clearErrorType,
  };
};
