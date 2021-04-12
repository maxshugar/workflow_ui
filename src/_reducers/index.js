import { combineReducers } from 'redux';

import { authentication } from './authentication_reducer';
import { registration } from './registration_reducer';
import { users } from './users_reducer';
import { alert } from './alert_reducer';

const rootReducer = combineReducers({
    authentication,
    registration,
    users,
    alert
});

export default rootReducer;