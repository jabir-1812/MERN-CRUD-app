import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import a from "../../api/adminAxios";
import adminApi from "../../api/adminAxios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  // const response = await fetch("/api/users");
  // return response.json();
  const response = await adminApi("/admin/users-list");
  console.log("user slice == response", response);
  return response.data.usersList;
});

export const addUser = createAsyncThunk("users/addUser", async (userData) => {
  const response = await adminApi.post(
    "/admin/create-user",
    userData,
    // {headers: {"Content-Type": "multipart/form-data"}}
  );
  console.log("user slice === add user == response:", response);
  return response.data.user;
});

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ formData: userData, userId }) => {
    console.log("userData", [...userData.entries()]);
    console.log("userId", userId);
    const response = await adminApi.put(`/admin/edit-user/${userId}`, userData);
    console.log("user slice == update user == response :", response);
    return response.data.user;
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    usersList: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.usersList.unshift(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.usersList.findIndex(
          (user) => user._id === action.payload._id,
        );

        if (index !== -1) {
          state.usersList[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
