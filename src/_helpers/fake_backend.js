// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let projects = JSON.parse(localStorage.getItem('projects')) || [];

export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        const { method, headers } = opts;
        const body = opts.body && JSON.parse(opts.body);
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);
            function handleRoute() {
                switch (true) {
                    case url.endsWith('/users/authenticate') && method === 'POST':
                        return authenticate();
                    case url.endsWith('/users/register') && method === 'POST':
                        return register();
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers();
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser();
                    case url.endsWith('/projects') && method === 'GET':
                        return getProjects();
                    case url.match(/\/projects\/\d+$/) && method === 'GET':
                        return getProject();
                    case url.match(/\/projects\/\d+$/) && method === 'PUT':
                        return updateProject();
                    case url.endsWith('/projects') && method === 'POST':
                        return createProject();
                    case url.match(/\/projects\/\d+$/) && method === 'DELETE':
                        return deleteProject();
                    case url.endsWith('/tasks') && method === 'POST':
                        return runTask();

                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { username, password } = body;
                const user = users.find(x => x.username === username && x.password === password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                });
            }

            function runTask(){
                console.log({body});
                return realFetch('http://localhost:4000/execute', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },    
                    body: JSON.stringify({ code: "hello world" })
                }).then(handleResponse);
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

            function register() {
                const user = body;

                if (users.find(x => x.username === user.username)) {
                    return error(`Username  ${user.username} is already taken`);
                }

                // assign user id and a few other properties then save
                user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }

            function getUsers() {
                if (!isLoggedIn()) return unauthorized();

                return ok(users);
            }

            function getProjects(){
                if (!isLoggedIn()) return unauthorized();

                return ok(projects);
            }

            function getProject(){
                const id = idFromUrl();
                if (!isLoggedIn()) return unauthorized();
                for(let i = 0; i < projects.length; i++){
                    let project = projects[i];
                    if(project.id === id)
                        return ok(project);
                }
                return error(`Project with id ${id} not found`);
            }

            function createProject() {

                console.log("Create project called!");

                const project = body;
                if (projects.find(x => x.name === project.name)) {
                    return error(`Project with name "${project.name}" is already taken.`);
                }
                // assign project id and a few other properties then save
                project.id = projects.length ? Math.max(...projects.map(x => x.id)) + 1 : 1;
                projects.push(project);
                localStorage.setItem('projects', JSON.stringify(projects));
                return ok();
            }

            function deleteProject() {
                if (!isLoggedIn()) return unauthorized();
                projects = projects.filter(x => x.id !== idFromUrl());
                localStorage.setItem('projects', JSON.stringify(projects));
                return ok();
            }

            function updateProject(project) {
                if (!isLoggedIn()) return unauthorized();
                projects[idFromUrl()] = project;
                localStorage.setItem('projects', JSON.stringify(projects));
                return ok();
            }

            function deleteUser() {
                if (!isLoggedIn()) return unauthorized();
                users = users.filter(x => x.id !== idFromUrl());
                localStorage.setItem('users', JSON.stringify(users));
                return ok();
            }

            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function isLoggedIn() {
                return headers['Authorization'] === 'Bearer fake-jwt-token';
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }
        });
    }
}