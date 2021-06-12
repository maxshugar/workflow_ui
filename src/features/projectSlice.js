import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAll = createAsyncThunk("projects/getAll", (code) => {
  return fetch("http://localhost:4000/v1/projects", {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
});

export const projectsSlice = createSlice({
  name: "projects",
  initialState: null,
  extraReducers: {
    [getAll.pending]: (state) => {
      state = {
        status: "loading",
        data: {},
        error: {},
      };
    },
    [getAll.fulfilled]: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      state = {
        status: "idle",
        data: action.payload,
        error: {},
      };
    },
    [getAll.rejected]: (state, action) => {
      state = {
        status: "idle",
        data: {},
        error: action.payload,
      };
    },
  },
});

export default projectsSlice;
