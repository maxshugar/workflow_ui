import { apiConstants } from '../_constants';
import { authHeader } from '../_helpers';

export const taskService = {
    run
};

function run(script) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: script
    };
    return fetch(`${apiConstants.apiUrl}/tasks`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}