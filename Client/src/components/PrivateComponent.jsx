import React from 'react'
import useAuthStatus from '../hooks/useAuthStatus'
import LoadingScreen from './LoadingScreen'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateComponent = () => {
 


    const {isLoggedIn, checkingStatus} = useAuthStatus()


    if(checkingStatus){
        return (
            <LoadingScreen  text='Checking User Authentication...'/>
        )
    }
    return isLoggedIn ? <Outlet/> : <Navigate to={"/login"}/>
}

export default PrivateComponent