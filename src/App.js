import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import {Home} from './containers/home';
import {Dash} from './containers/dash';
import {Editor} from './containers/editor';
import {ReactNav} from './components/navbar'

function App() {
  return (
    <React.Fragment>
      <ReactNav/>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/dashboard" component={Dash}/>
          <Route path="/editor" component={Editor}/>
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
