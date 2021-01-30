import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import TooltipButton from "../TooltipButton/TooltipButton";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Favorite from "@material-ui/icons/Favorite";

import { initLikeScream, initUnlikeScream } from "../../store/actions/data";

function LikeButton(props) {
  const { screamId } = props;
  const isLiked = useSelector((state) =>
    state.user.likes.some((like) => like.likeScreamId === screamId)
  );
  const changingLike = useSelector(
    (state) =>
      state.data.screams.find((scream) => scream.data.screamId === screamId)
        .uiStatus.changingLike
  );
  const authenticated = useSelector((state) => state.user.authenticated);
  const dispatch = useDispatch();
  const likeScream = useCallback(() => {
    dispatch(initLikeScream(screamId));
  }, [dispatch, screamId]);

  const unlikeScream = useCallback(() => {
    dispatch(initUnlikeScream(screamId));
  }, [dispatch, screamId]);
  const likeButton = !authenticated ? (
    <Link to="/login">
      <TooltipButton title="Like">
        <FavoriteBorder color="primary" />
      </TooltipButton>
    </Link>
  ) : isLiked ? (
    <TooltipButton
      title="Undo like"
      onClick={unlikeScream}
      disabled={changingLike}
    >
      <Favorite color="primary" />
    </TooltipButton>
  ) : (
    <TooltipButton title="Like" onClick={likeScream} disabled={changingLike}>
      <FavoriteBorder color="primary" />
    </TooltipButton>
  );
  return likeButton;
}

export default LikeButton;
