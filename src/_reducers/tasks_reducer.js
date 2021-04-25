import { taskConstants } from '../_constants';

export function tasks(state = {}, action) {
    switch (action.type) {
        case taskConstants.RUN_REQUEST:
            return {
                loading: true
            };
        case taskConstants.RUN_SUCCESS:
            return {
                item: action.result
            };
        case taskConstants.RUN_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}