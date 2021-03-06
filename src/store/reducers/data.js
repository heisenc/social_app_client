import * as actionTypes from "../actions/actionTypes";

const initialState = {
  screams: [],
  hasNextPage: false,
  scream: null,
  loading: {
    screams: false,
    postScream: false,
    scream: false,
    postComment: false,
    getUserData: false,
  },
  errors: [],
  userData: null,
};

const replaceScream = (screamData, screams, updatedUiStatus) => {
  const updatedScreams = [...screams];
  const updatedScream = { data: { ...screamData } };
  const updateIndex = screams.findIndex(
    (scream) => scream.data.screamId === updatedScream.data.screamId
  );
  if (updatedUiStatus) {
    updatedScream.uiStatus = {
      ...updatedScreams[updateIndex].uiStatus,
      ...updatedUiStatus,
    };
  } else {
    updatedScream.uiStatus = {
      ...updatedScreams[updateIndex].uiStatus,
    };
  }
  updatedScreams[updateIndex] = updatedScream;
  return updatedScreams;
};

const updateLikecount = (state, action) => {
  const updatedLikeScreamData = action.screamData;
  const updatedState = {
    ...state,
    errors: state.errors.filter((err) => err.type !== action.clearErrorType),
    screams: replaceScream(updatedLikeScreamData, state.screams, {
      changingLike: false,
    }),
  };
  if (
    !state.scream ||
    state.scream.screamId !== updatedLikeScreamData.screamId
  ) {
    return updatedState;
  }
  updatedState.scream = {
    ...state.scream,
    likeCount: updatedLikeScreamData.likeCount,
  };
  return updatedState;
};

const initialScreamUistatus = { changingLike: false, deleting: false };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DATA_START:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.updateLoading,
        },
        errors: state.errors.filter(
          (err) => err.type !== action.clearErrorType
        ),
      };
    case actionTypes.SET_DATA_FAIL:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.updateLoading,
        },
        errors: [].concat(action.error, state.errors),
      };
    case actionTypes.SET_SCREAMS:
      return {
        ...state,
        loading: {
          ...state.loading,
          screams: false,
        },
        hasNextPage: action.hasNextPage,
        screams: action.recent
          ? action.screamsData.map((screamData) => ({
              data: screamData,
              uiStatus: { ...initialScreamUistatus },
            }))
          : [
              ...state.screams,
              ...action.screamsData.map((screamData) => ({
                data: screamData,
                uiStatus: { ...initialScreamUistatus },
              })),
            ],
      };
    case actionTypes.LIKE_SCREAM:
      return updateLikecount(state, action);
    case actionTypes.UNLIKE_SCREAM:
      return updateLikecount(state, action);
    case actionTypes.UPDATE_LIKE_FAIL:
      const failScreamData = state.screams.find(
        (scream) => scream.data.screamId === action.screamId
      ).data;
      return {
        ...state,
        screams: replaceScream(failScreamData, state.screams, {
          changingLike: false,
        }),
        errors: [].concat(action.error, state.errors),
      };
    case actionTypes.SET_CHANING_LIKE:
      const screamData = state.screams.find(
        (scream) => scream.data.screamId === action.screamId
      ).data;
      return {
        ...state,
        screams: replaceScream({ ...screamData }, state.screams, {
          changingLike: true,
        }),
        errors: state.errors.filter(
          (err) => err.type !== "LIKE_SCREAM" && err.type !== "UNLIKE_SCREAM"
        ),
      };
    case actionTypes.DELETE_SCREAM:
      return {
        ...state,
        screams: state.screams.filter(
          (scream) => scream.data.screamId !== action.screamId
        ),
      };
    case actionTypes.SET_DELETING_SCREAM:
      const deletingScream = state.screams.find(
        (scream) => scream.data.screamId === action.screamId
      ).data;
      return {
        ...state,
        errors: state.errors.filter((err) => err.type !== "DELETE_SCREAM"),
        screams: replaceScream({ ...deletingScream }, state.screams, {
          deleting: true,
        }),
      };
    case actionTypes.POST_SCREAM:
      return {
        ...state,
        screams: state.screams.some(
          (scream) => scream.data.userName === action.newScreamData.userName
        )
          ? [
              {
                data: action.newScreamData,
                uiStatus: { ...initialScreamUistatus },
              },
              ...state.screams,
            ]
          : state.screams,
        loading: {
          ...state.loading,
          postScream: false,
        },
      };
    case actionTypes.SET_SCREAM:
      const { comments, ...screamDaataWithoutComments } = action.screamData;
      return {
        ...state,
        loading: {
          ...state.loading,
          scream: false,
        },
        screams: state.screams.some(
          (scream) =>
            scream.data.screamId === screamDaataWithoutComments.screamId
        )
          ? replaceScream(screamDaataWithoutComments, state.screams)
          : [
              {
                data: screamDaataWithoutComments,
                uiStatus: { ...initialScreamUistatus },
              },
            ],
        scream: {
          ...action.screamData,
          comments: action.screamData.comments.map((commentData) => ({
            data: { ...commentData },
            uiStatus: { changingLike: false },
          })),
        },
      };
    case actionTypes.CLEAR_SCREAM:
      return {
        ...state,
        scream: null,
      };
    case actionTypes.POST_COMMENT:
      const addedCommentScreamData = state.screams.find(
        (scream) => scream.data.screamId === action.newCommentData.screamId
      ).data;
      return {
        ...state,
        screams: replaceScream(
          {
            ...addedCommentScreamData,
            commentCount: state.scream.commentCount + 1,
          },
          state.screams,
          null
        ),
        scream: {
          ...state.scream,
          commentCount: state.scream.commentCount + 1,
          comments: [
            { data: action.newCommentData, uiStatus: { changingLike: false } },
            ...state.scream.comments,
          ],
        },
        loading: {
          ...state.loading,
          postComment: false,
        },
      };

    case actionTypes.SET_USER_DATA:
      const { user, screams: screamsData, hasNextPage } = action.userData;
      return {
        ...state,
        loading: {
          ...state.loading,
          getUserData: false,
        },
        screams: screamsData.map((screamData) => ({
          data: screamData,
          uiStatus: { changingLike: false, deleting: false },
        })),
        hasNextPage,
        userData: user,
      };
    case actionTypes.CLEAR_DATA_ERROR:
      const newState = { ...state };

      if (!action.clearErrorType) {
        newState.errors = [];
      } else {
        newState.errors = state.errors.filter(
          (err) => err.type !== action.clearErrorType
        );
      }

      if (!action.clearData) {
        return newState;
      }

      if (action.clearData.scream) {
        newState.scream = null;
        newState.screams =
          state.screams.length === 1 &&
          state.screams[0].data.screamId === state.scream.screamId
            ? []
            : state.screams;
      }

      if (action.clearData.screams) {
        newState.screams = [];
      }

      return newState;
    default:
      return state;
  }
};

export default reducer;
