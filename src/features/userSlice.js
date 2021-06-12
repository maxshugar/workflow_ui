import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const authenticate = createAsyncThunk("user/authenticate", (code) => {
  return fetch("http://localhost:4000/v1/authenticate", {
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

export const userSlice = createSlice({
  name: "user",
  initialState: {
    gitClientId: "b3ac5023e223abb1c47a",
    gitRedirectUri: "http://localhost:3000/login",
    user: localStorage.getItem("user")
      ? {
          status: "idle",
          data: JSON.parse(localStorage.getItem("user")),
          error: {},
        }
      : null,
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.isSignedIn = false;
      state.user = null;
    },
  },
  extraReducers: {
    [authenticate.pending]: (state) => {
      state.user = {
        status: "loading",
        data: {},
        error: {},
      };
    },
    [authenticate.fulfilled]: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.user = {
        status: "idle",
        data: action.payload,
        error: {},
      };
    },
    [authenticate.rejected]: (state, action) => {
      state.user = {
        status: "idle",
        data: {},
        error: action.payload,
      };
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice;
