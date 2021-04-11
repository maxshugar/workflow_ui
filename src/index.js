import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import './fonts/myriad_pro_bold.ttf';
import {Provider} from 'react-redux';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, 
    document.getElementById('root')
);
