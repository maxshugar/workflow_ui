import { projectConstants } from '../_constants';
import { projectService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const projectActions = {
    getAll,
    get,
    create,
    update,
    delete: _delete
};

function getAll() {
    return dispatch => {
        dispatch(request());

        projectService.getAll()
            .then(
                projects => dispatch(success(projects)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: projectConstants.GETALL_REQUEST } }
    function success(projects) { return { type: projectConstants.GETALL_SUCCESS, projects } }
    function failure(error) { return { type: projectConstants.GETALL_FAILURE, error } }
}

function get(id){  
    

    return dispatch => {
        dispatch(request(id));
        projectService.get(id)
            .then(
                project => dispatch(success(project)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: projectConstants.GET_REQUEST } }
    function success(project) { return { type: projectConstants.GET_SUCCESS, project } }
    function failure(error) { return { type: projectConstants.GET_FAILURE, error } }
}



// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        projectService.delete(id)
            .then(
                project => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: projectConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: projectConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: projectConstants.DELETE_FAILURE, id, error } }
}

function create(project) {
    return dispatch => {
        dispatch(request(project));

        projectService.create(project)
            .then(
                project => { 
                    dispatch(success());
                    // history.push(`/projects/${project.id}`);
                    dispatch(alertActions.success('Project created.'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(project) { return { type: projectConstants.CREATE_REQUEST, project } }
    function success(project) { return { type: projectConstants.CREATE_SUCCESS, project } }
    function failure(error) { return { type: projectConstants.CREATE_FAILURE, error } }
}

function update(project) {
    return dispatch => {
        dispatch(request(project));

        projectService.update(project)
            .then(
                project => { 
                    dispatch(success());
                    history.push(`/projects/${project.id}`);
                    dispatch(alertActions.success('Project updated.'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(project) { return { type: projectConstants.UPDATE_REQUEST, project } }
    function success(project) { return { type: projectConstants.UPDATE_SUCCESS, project } }
    function failure(error) { return { type: projectConstants.UPDATE_FAILURE, error } }
}