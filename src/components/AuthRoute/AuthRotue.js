import React from "react";
import { Route, Redirect } from "react-router-dom";

function AuthRotue({ component: Component, authenticated, ...rest }) {
  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <Route component={Component} {...rest} />
  );
}

export default AuthRotue;
