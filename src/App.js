import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './app.css';

// import {Home} from './containers/home';
// import {Dash} from './containers/dash';
// import {Editor} from './containers/editor';
import NavBar from './components/navbar'

function App() {

  return (
    <NavBar/>
    // <React.Fragment>
    //   <ReactNav/>
    //   <Router>
    //     <Switch>
    //       <Route exact path="/" component={Home}/>
    //       <Route path="/dashboard" component={Dash}/>
    //       <Route path="/editor" component={Editor}/>
    //       <Route path="/docs" component={Dash}/>
    //       <Route path="/examples" component={Dash}/>
    //       <Route path="/login" component={Dash}/>
    //       <Route path="/register" component={Dash}/>
    //     </Switch>
    //   </Router>
    // </React.Fragment>
  );
}

export default App;
 