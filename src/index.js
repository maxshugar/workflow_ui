import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { App } from './_components/app';
import { history } from './helpers';
import './index.css';
import store from './helpers/store';
 
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>, 
    document.getElementById('root')
);