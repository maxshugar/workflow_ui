import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Home} from './containers/home';
import {Docs} from './containers/docs';
import {NavBar} from './components/navbar'

function App() {

  return (
    // <React.Fragment>
    //   <NavBar/>
    //   <Editor/>
    // </React.Fragment>
    
    <React.Fragment>
      <NavBar/>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/docs" component={Docs}/>
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
 