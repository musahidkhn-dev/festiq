import api from "../../utils/axiosConfig"

const fetchEvents = async (params = {}) => {
    const response = await api.get("/events", { params })
    return response.data
}

const fetchEvent = async (id) => {
    const response = await api.get(`/events/${id}`)
    return response.data
}

const createEvent = async (formData) => {
    // Note: formData may contain files, interceptor adds headers.
    const response = await api.post("/events", formData)
    return response.data
}

const addReview = async (id, reviewData) => {
    const response = await api.post(`/events/${id}/reviews`, reviewData)
    return response.data
}

const deleteReview = async (id, reviewId) => {
    const response = await api.delete(`/events/${id}/reviews/${reviewId}`)
    return response.data
}

const updateReview = async (id, reviewId, reviewData) => {
    const response = await api.put(`/events/${id}/reviews/${reviewId}`, reviewData)
    return response.data
}

const hostEvent = async (formData) => {
    const response = await api.post("/events/host", formData)
    return response.data
}

const fetchMyHostedEvents = async () => {
    const response = await api.get("/events/hosted")
    return response.data
}

const fetchCreatorAnalytics = async () => {
    const response = await api.get("/events/creator-analytics")
    return response.data
}

const moderateEvent = async (id, approvalStatus) => {
    const response = await api.put(`/events/${id}/moderate`, { approvalStatus })
    return response.data
}

const updateBookingStatus = async (oid, status) => {
    const response = await api.patch(`/orders/${oid}/status`, { status })
    return response.data
}

const toggleLike = async (id) => {
    const response = await api.post(`/events/${id}/like`)
    return response.data
}

const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`)
    return response.data
}

const updateEvent = async (id, formData) => {
    const response = await api.put(`/events/${id}`, formData)
    return response.data
}

const eventService = { fetchEvents, fetchEvent, createEvent, addReview, deleteReview, updateReview, hostEvent, fetchMyHostedEvents, moderateEvent, fetchCreatorAnalytics, updateBookingStatus, toggleLike, deleteEvent, updateEvent }

export default eventService