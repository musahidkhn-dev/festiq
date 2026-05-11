import api from "../../utils/axiosConfig"

const fetchComments = async (eid) => {
    const response = await api.get(`/comment/${eid}`)
    return response.data
}

const addComment = async (eid, commentData) => {
    const response = await api.post(`/comment/${eid}`, commentData)
    return response.data
}

const commentService = { fetchComments, addComment }

export default commentService
