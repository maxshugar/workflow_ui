import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { history } from './_helpers';
import { PrivateRoute } from './_components';
import { alertActions } from './_actions';
import {NavBar} from './components/navbar'
import {Home} from './containers/home';
import {Docs} from './containers/docs';
import {Login} from './containers/login';
import {Projects} from './containers/projects';

import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        }); 
    }, []);

  return (
    <React.Fragment>
      <Router>
        <NavBar/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/docs" component={Docs}/>
          <Route path="/login" component={Login}/>
          <PrivateRoute path="/projects" component={Projects}/>
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
 