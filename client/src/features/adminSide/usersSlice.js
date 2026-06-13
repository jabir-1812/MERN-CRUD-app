import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import a from "../../api/adminAxios";
import adminApi from "../../api/adminAxios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async ({page=1, search=""}) => {
  // const response = await fetch("/api/users");
  // return response.json();
  const response = await adminApi(`/admin/users-list?page=${page}&search=${search}`);
  console.log("user slice == response", response);
  return response.data;
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


export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (userId) => {
        const response = await adminApi.delete(`/admin/delete-user/${userId}`);
        console.log("userSlice >> deleteUser >> response:", response)
        return response.data.deletedUserData._id
    }
)


export const undeleteUser = createAsyncThunk(
    "users/undeleteUser",
    async (userId) => {
        const response = await adminApi.patch(`/admin/undelete-user/${userId}`);
        console.log("userSlice >> undeleteUser >> response:", response)
        return response.data.undeletedUserData._id
    }
)

const userSlice = createSlice({
  name: "users",
  initialState: {
    usersList: [],
    loading: false,
    error: null,

    searchTerm: "",

    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
  },
  reducers:{
    setSearchTerm: (state, action)=>{
        state.searchTerm = action.payload
    },
    setCurrentPage: (state, action)=>{
        state.currentPage = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload.usersList;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalUsers = action.payload.totalUsers;

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
      })
      .addCase(deleteUser.fulfilled, (state, action)=>{
        console.log("userdata id, ", action.payload)
        // state.usersList = state.usersList.filter((user)=> {
        //     return user._id !== action.payload
        // })
        const index = state.usersList.findIndex((user)=>{
            return user._id === action.payload._id
        })

        if(index !== -1){
            state.usersList[index].isDeleted = true;
        }
      })
      .addCase(undeleteUser.fulfilled, (state, action)=>{
        console.log("userdata id, ", action.payload)
        // state.usersList = state.usersList.filter((user)=> {
        //     return user._id !== action.payload
        // })
        const index = state.usersList.findIndex((user)=>{
            return user._id === action.payload._id
        })

        if(index !== -1){
            state.usersList[index].isDeleted = false;
        }
      })
  },
});

export const {setSearchTerm, setCurrentPage} = userSlice.actions;
export default userSlice.reducer;

