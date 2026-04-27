import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "./adminService";

const initialState = {
  users: [],
  events: [],
  orders: [],
  ratings: [],
  coupons: [],
  adminLoading: false,
  adminSuccess: false,
  adminError: false,
  adminErrorMessage: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers : (builder) => {
    builder
    .addCase(getAllUsers.pending , (state, action) => {
        state.adminLoading = true
        state.adminSuccess = false
        state.adminError = false
    })
    .addCase(getAllUsers.fulfilled , (state, action) => {
        state.adminLoading = false
        state.adminSuccess = true
        state.users = action.payload
        state.adminError = false
    })
    .addCase(getAllUsers.rejected , (state, action) => {
        state.adminLoading = false
        state.adminSuccess = false
        state.adminError = true
        state.adminErrorMessage = action.payload
    })
    
  }
 });

export const {} = adminSlice.actions;

export default adminSlice.reducer;

export const getAllUsers = createAsyncThunk("FETCH/ADMIN/USERS",  async (_, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await adminService.fetchAllUsers(token)
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
