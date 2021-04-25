import { taskConstants } from '../_constants';
import { taskService } from '../_services';

export const taskActions = {
    run
};

function run(script){  
    return dispatch => {
        dispatch(request(script));
        taskService.run(script)
            .then(
                result => dispatch(success(result)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: taskConstants.RUN_REQUEST } }
    function success(result) { return { type: taskConstants.RUN_SUCCESS, result } }
    function failure(error) { return { type: taskConstants.RUN_FAILURE, error } }
}