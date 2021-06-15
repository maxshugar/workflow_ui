import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "../features/projectSlice";
import userSlice from "../features/userSlice";

export default configureStore({
    reducer:{
        user: userSlice.reducer,
        project: projectSlice.reducer
    }
})
