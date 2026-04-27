import { useSelector } from "react-redux"

const useAuthStatus = () => {
    
    const { user } = useSelector(state => state.auth)

    const isLoggedIn = !!user
    const checkingStatus = false

    return { isLoggedIn, checkingStatus }
}


export default useAuthStatus