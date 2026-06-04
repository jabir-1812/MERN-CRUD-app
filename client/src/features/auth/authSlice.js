import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    user: null,
    loading: true
};
// user: {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin
// }

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
        }, 

        updateUser(state, action) {
            state.user = action.payload;
        }
    }
});

export const { setCredentials, logout, setLoading, updateUser } = authSlice.actions;

export default authSlice.reducer;