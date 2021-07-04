import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { store } from 'react-notifications-component';

export const getAll = createAsyncThunk("projects/getAll", (code) => {
  return fetch("http://localhost:4000/v1/project", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
});

export const create = createAsyncThunk(
  "project/create",
  ({ accessToken, name, ownerId }) => {
    console.log(accessToken);
    return fetch("http://localhost:4000/v1/project", {
      method: "POST",
      body: JSON.stringify({
        _id: name,
        ownerId,
        elements: [
          {
            id: "Start",
            type: "StartNode",
            data: {
              label: "Start",
              script: "",
              breakpoints: [],
            },
            position: { x: 250, y: 100 },
          },
          {
            id: "End",
            type: "EndNode",
            data: {
              label: "End",
              script: "",
              breakpoints: [],
            },
            position: { x: 250, y: 300 },
          }
        ],
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `token ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => error);
  }
);

export const update = createAsyncThunk("project/update", (project) => {
  return fetch(`http://localhost:4000/v1/project/${project.id}`, {
    method: "PUT",
    body: JSON.stringify(project),
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
});

export const deleteProject = createAsyncThunk("project/deleteProject", (id) => {
  return fetch(`http://localhost:4000/v1/project/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
});

export const get = createAsyncThunk("project/get", (id) => {
  return fetch(`http://localhost:4000/v1/project/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((error) => error);
});

const makeFulfilledState = (action) => {
  return {
    status: "idle",
    data: action.payload.ok ? action.payload.msg : {},
    error: action.payload.ok ? {} : action.payload.err,
  };
};

const makePendingState = () => {
  return {
    status: "loading",
    data: null,
    error: null,
  };
};

const makeRejectedState = (action) => {
  return {
    status: "idle",
    data: {},
    error: action.payload,
  };
};

const makeInitialState = () => {
  return { status: "idle", data: null, error: null };
};

const displayNotification = (title, message, type) => {
  store.addNotification({
    title,
    message,
    type,
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animate__animated", "animate__flipInX"],
    animationOut: ["animate__animated", "animate__flipOutX"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
}

export const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: makeInitialState(),
    projects: makeInitialState(),
  },
  reducers: {
    clearProject: (state) => {
      state.project = makeInitialState();
      //state.projects = makeInitialState();
    },
  },
  extraReducers: {
    [getAll.pending]: (state) => {
      state.projects = makePendingState();
    },
    [getAll.fulfilled]: (state, action) => {
      state.projects = makeFulfilledState(action);
    },
    [getAll.rejected]: (state, action) => {
      displayNotification("Failure", "Could not retrieve projects.", "danger");
      state.projects = makeRejectedState(action);
    },
    [create.pending]: (state) => {
      state.project = makePendingState();
    },
    [create.fulfilled]: (state, action) => {
      console.log(state)
      displayNotification("Success", "Project created successfully.", "success");
      state.project = makeFulfilledState(action);
    },
    [create.rejected]: (state, action) => {
      displayNotification("Failure", "Project creation failed.", "danger");
      state.project = makeRejectedState(action);
    },
    [get.pending]: (state) => {
      state.project = makePendingState();
    },
    [get.fulfilled]: (state, action) => {
      state.project = makeFulfilledState(action);
    },
    [get.rejected]: (state, action) => {
      state.project = makeRejectedState(action);
    },
    [update.pending]: (state) => {
      state.project = makePendingState();
    },
    [update.fulfilled]: (state, action) => {
      displayNotification("Success", "Project saved successfully.", "success");
      state.project = makeFulfilledState(action);
    },
    [update.rejected]: (state, action) => {
      displayNotification("Failure", "Project could not be saved.", "danger");
      state.project = makeRejectedState(action);
    },
    [deleteProject.fulfilled]: (state, action) => {
      let c = current(state);
      let x = c.projects.data.filter(p => action.payload.msg._id !== p._id)
      let newState = {
        data: x,
        status: 'idle',
        error: {}
      }
      state.projects = newState
      displayNotification("Success", "Project deleted successfully.", "success");
    },
    [deleteProject.rejected]: (state, action) => {
      displayNotification("Failure", "Project could not be deleted.", "danger");
      state.projects = makeRejectedState(action);
    },
  },
});

export const { clearProject } = projectSlice.actions;

export default projectSlice;
 