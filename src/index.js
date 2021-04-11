import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './app';
import store from './store';
import './fonts/myriad_pro_bold.ttf';
import './index.css';

// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, 
    document.getElementById('root')
);