import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import eventService from './eventService';

const initialState = {

    events : [],
    event : {},
    eventLoading : false,
    eventSuccess : false,
    eventError : false,
    eventErrorMessage : ""
}

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers : (builder) => {
    builder
    .addCase(getEvents.pending, (state) => {
        state.eventLoading = true
        state.eventSuccess = false
        state.eventError = false
    })
    .addCase(getEvents.fulfilled, (state, action) => {
        state.eventLoading = false
        state.eventSuccess = true
        state.events = action.payload
        state.eventError = false
    })
    .addCase(getEvents.rejected, (state, action) => {
        state.eventLoading = false
        state.eventSuccess = false
        state.eventError = true
        state.eventErrorMessage = action.payload
    })
  }
});

export const {} = eventSlice.actions

export default eventSlice.reducer

// Get Events
export const getEvents = createAsyncThunk("EVENTS/FETCH" , async(_ , thunkAPI) => {
try {
   return await eventService.fetchEvents() 
} catch (error) {
     let message = error.response.data.message 
    return thunkAPI.rejectWithValue(message)
}
})