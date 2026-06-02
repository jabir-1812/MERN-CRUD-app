import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    user: null,
    loading: true
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },

        logout: (state) => {
            state.accessToken = null;
            state.user = null;
        },

        setLoading: (state, action)=>{
            state.loading = action.payload
        }
    }
});

export const { setCredentials, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;