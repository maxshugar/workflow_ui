import { combineReducers } from 'redux';

import { authentication } from './authentication_reducer';
import { registration } from './registration_reducer';
import { users } from './users_reducer';
import { alert } from './alert_reducer';
import { projects } from './projects_reducer';
import { tasks } from './tasks_reducer';

const rootReducer = combineReducers({
    authentication,
    registration,
    users,
    alert,
    projects,
    tasks
});

export default rootReducer;