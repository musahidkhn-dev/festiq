import { configureStore } from '@reduxjs/toolkit'
import auth from "./auth/authSlice"

// We removed event, order, and admin slices as they are now handled by React Query
const store = configureStore({
    reducer : { auth }
})

export default store