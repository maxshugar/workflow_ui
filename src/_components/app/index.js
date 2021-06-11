import React, { createContext, useEffect, useReducer } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { history } from "../../_helpers";
import { PrivateRoute } from "../private_route";
import { alertActions } from "../../_actions";
import { NavBar } from "../../components/navbar";
import { Home } from "../../containers/home";
import { Docs } from "../../containers/docs";
import { Login } from "../../containers/login/index";
import { Projects } from "../../containers/projects";
import { NewProject } from "../../containers/projects/new";
import { Project } from "../../_components/project";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Register } from "../../containers/register";
import { useLocation } from "react-router-dom";

import { initialState, reducer } from "../../store/reducer";

export const AuthContext = createContext();

export const App = () => {
  const location = useLocation();

  const [state, dispatch] = useReducer(reducer, initialState);

  const alert = useSelector((state) => state.alert);
  //const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <React.Fragment>
        <NavBar location={location} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/docs" component={Docs} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/projects" exact component={Projects} />
          <PrivateRoute path="/projects/new" component={NewProject} />
          <PrivateRoute path="/projects/:id" component={Project} />
          <Redirect from="*" to="/" />
        </Switch>
      </React.Fragment>
    </AuthContext.Provider>
  );
};
