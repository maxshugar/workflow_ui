import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
    console.log(accessToken)
    return fetch("http://localhost:4000/v1/project", {
      method: "POST",
      body: JSON.stringify({ _id: name, ownerId }),
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `token ${accessToken}`
      },
    })
      .then((response) => response.json())
      .catch((error) => error);
  }
);

export const get = createAsyncThunk("project/get", (id) => {
  console.log(id);
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

export const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: makeInitialState(),
    projects: makeInitialState(),
  },
  reducers: {
    clearProject: (state) => {
      state.project = makeInitialState();
    },
  },
  extraReducers: {
    [getAll.pending]: (state) => {
      state.projects = makePendingState();
    },
    [getAll.fulfilled]: (state, action) => {
      console.log(action);
      state.projects = makeFulfilledState(action);
    },
    [getAll.rejected]: (state, action) => {
      state.projects = makeRejectedState(action);
    },
    [create.pending]: (state) => {
      state.project = makePendingState();
    },
    [create.fulfilled]: (state, action) => {
      state.project = makeFulfilledState(action);
    },
    [create.rejected]: (state, action) => {
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
  },
});

export const { clearProject } = projectSlice.actions;

export default projectSlice;
