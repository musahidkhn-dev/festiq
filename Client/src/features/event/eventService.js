import api from "../../utils/axiosConfig"

const fetchEvents = async () => {
    const response = await api.get("/events")
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

const eventService = { fetchEvents, fetchEvent, createEvent }

export default eventService