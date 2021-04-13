import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { App } from './_components/app';
import { history } from './_helpers';
import { store } from './_helpers';
import './index.css';

// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();
 
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>, 
    document.getElementById('root')
);