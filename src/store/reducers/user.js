import * as actionTypes from "../actions/actionTypes";
import axios from "axios";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: null,
  likes: [],
  notifications: [],
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.SET_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.AUTH_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        authenticated: true,
        loading: false,
        ...action.payload,
      };

    case actionTypes.AUTH_LOGOUT:
      localStorage.removeItem("FBIdToken");
      delete axios.defaults.headers.common["Authorization"];
      return initialState;

    case actionTypes.UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        credentials: {
          ...state.credentials,
          imageUrl: action.imageUrl,
        },
      };
    case actionTypes.EDIT_DETIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        credentials: {
          ...state.credentials,
          ...action.credentials,
        },
      };

    case actionTypes.LIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.concat(action.likeData),
      };

    case actionTypes.UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.likeScreamId !== action.screamData.screamId
        ),
      };

    case actionTypes.MARK_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map((noti) => ({
          ...noti,
          read: true,
        })),
      };

    case actionTypes.CLEAR_DATA_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default reducer;
