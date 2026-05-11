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

const fetchProfile = async () => {
    const response = await api.get("/auth/me")
    return response.data
}

const updateProfile = async (formData) => {
    const response = await api.put("/auth/me", formData)
    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const changePassword = async (formData) => {
    const response = await api.put("/auth/me/password", formData)
    return response.data
}

const forgotPassword = async (formData) => {
    const response = await api.post("/auth/forgot-password", formData)
    return response.data
}

const updateAvatar = async (formData) => {
    const response = await api.put("/auth/avatar", formData)
    // Update localStorage with new user data (which includes profilePicture)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const deleteAvatar = async () => {
    const response = await api.delete("/auth/avatar")
    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const authService = { register, login, fetchProfile, updateProfile, changePassword, forgotPassword, updateAvatar, deleteAvatar }

export default authService