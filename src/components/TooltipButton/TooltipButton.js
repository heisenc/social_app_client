import React from "react";

import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

function TooltipButton(props) {
  const {
    children,
    onClick,
    title,
    btnClassName,
    tipClassName,
    disabled,
  } = props;
  return (
    <Tooltip title={title} className={tipClassName} placement="top">
      <IconButton onClick={disabled ? null : onClick} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  );
}

export default TooltipButton;
