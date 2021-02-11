import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { useSelector, useDispatch } from "react-redux";

import Home from "./containers/Home/Home";
import Login from "./containers/Auth/Login/Login";
import Signup from "./containers/Auth/Signup/Signup";
import User from "./containers/User/User";
import ScreamDetail from "./containers/ScreamDetail/ScreamDetail";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import themeConfig from "./util/theme";
import AuthRoute from "./components/AuthRoute/AuthRotue";
import { checkAuth } from "./store/actions/user";
import axios from "axios";

const theme = createMuiTheme(themeConfig);

axios.defaults.baseURL =
  "https://asia-east2-social-app-655bc.cloudfunctions.net/api";

// let authenticated;
// const token = localStorage.getItem("idToken");
// if (token) {
//   const decodedToken = jwtDecode(token.split("Bearer ")[1]);
//   if (decodedToken.exp * 1000 < Date.now()) {
//     authenticated = false;
//   }
//   authenticated = true;
// }

function App() {
  const authenticated = useSelector((state) => state.user.authenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <Route path="/" exact component={Home} />
            <AuthRoute
              path="/signup"
              exact
              component={Signup}
              authenticated={authenticated}
            />
            <AuthRoute
              path="/login"
              exact
              component={Login}
              authenticated={authenticated}
            />
            <Route exact path={`/users/:userName`} component={User} />
            <Route
              exact
              path={`/users/:userName/scream/:screamId`}
              component={ScreamDetail}
            />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
