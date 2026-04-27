import api from "../../utils/axiosConfig"

const fetchTickets = async () => {
    const response = await api.get("/order")
    return response.data
}

const fetchTicket = async (tid) => {
    const response = await api.get(`/order/${tid}`)
    return response.data
}

const bookTicket = async (eid) => {
    const response = await api.post(`/order/${eid}`)
    return response.data
}

const cancelTicket = async (tid) => {
    const response = await api.put(`/order/${tid}`)
    return response.data
}

const orderService = { fetchTickets, fetchTicket, bookTicket, cancelTicket } 

export default orderService