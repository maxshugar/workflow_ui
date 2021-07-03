import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { PrivateRoute } from "../private_route";
import { NavBar } from "../navbar";
import { Home } from "../home";
import { Docs } from "../docs";
import { Login } from "../login/index";
import { Projects } from "../projects";
import { NewProject } from "../projects/new";
import { Project } from "../project";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useLocation } from "react-router-dom";

export const App = () => {
  const location = useLocation();
  return (
    <React.Fragment>
      <NavBar location={location} />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/docs" component={Docs} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/projects" exact component={Projects} />
        <PrivateRoute path="/projects/new" component={NewProject} />
        <PrivateRoute path="/projects/:id" component={Project} />
        <Redirect from="*" to="/" />
      </Switch>
    </React.Fragment>
  );
};
