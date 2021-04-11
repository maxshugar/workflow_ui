import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './private_route';
import {AuthContext} from "./context/auth";
import {Home} from './containers/home';
import {Docs} from './containers/docs';
import {NavBar} from './components/navbar'
import {Projects} from './containers/projects';
import {Login} from './containers/login';

import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <React.Fragment>
          <Router>
            <NavBar/>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/docs" component={Docs}/>
              <Route path="/login" component={Login}/>
              <PrivateRoute path="/projects" component={Projects}/>
            </Switch>
          </Router>
        </React.Fragment>
      </AuthContext.Provider>
  );
}

export default App;
 