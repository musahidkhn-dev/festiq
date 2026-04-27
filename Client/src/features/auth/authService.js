import api from "../../utils/axiosConfig"

const register = async (formData) => {
    const response = await api.post("/auth/register", formData) 
    localStorage.setItem('user' , JSON.stringify(response.data))
    return response.data
}

const login = async (formData) => {
    const response = await api.post("/auth/login", formData) 
    localStorage.setItem('user' , JSON.stringify(response.data))
    return response.data
}

const authService = { register, login }

export default authService