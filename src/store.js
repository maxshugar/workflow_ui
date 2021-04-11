import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/user_slice';

export default configureStore({
    reducer: {
        user: userReducer
    }
})