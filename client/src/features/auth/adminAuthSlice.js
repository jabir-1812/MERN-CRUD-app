import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminAccessToken: null,
    adminData: null,
    adminDashboardLoading: true
};
// adminData: {
//     id: ,
//     name: ,
//     email: ,
//     isAdmin: 
// }

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        setAdminCredentials: (state, action) => {
            state.adminAccessToken = action.payload.adminAccessToken;
            state.adminData = action.payload.adminData;
        },

        adminLogout: (state) => {
            state.adminAccessToken = null;
            state.adminData = null;
        },

        setAdminDashboardLoading: (state, action)=>{
            state.adminDashboardLoading = action.payload
        }
    }
});

export const { setAdminCredentials, adminLogout, setAdminDashboardLoading } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;