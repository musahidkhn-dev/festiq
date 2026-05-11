import api from "../../utils/axiosConfig"

const fetchTickets = async () => {
    const response = await api.get("/orders")
    return response.data
}

const fetchTicket = async (tid) => {
    const response = await api.get(`/orders/${tid}`)
    return response.data
}

const bookTicket = async ({ eid, numberOfSeats, couponCode }) => {
    const response = await api.post(`/orders/${eid}`, { numberOfSeats, couponCode })
    return response.data
}

const validateCoupon = async (couponData) => {
    // couponData: { couponCode, eventId, numberOfSeats }
    const response = await api.post("/coupons/validate-coupon", couponData)
    return response.data
}

const cancelTicket = async (tid) => {
    const response = await api.put(`/orders/${tid}`)
    return response.data
}

const fetchMyCoupons = async () => {
    const response = await api.get("/coupons/my-coupons");
    return response.data;
}

const orderService = { fetchTickets, fetchTicket, bookTicket, cancelTicket, validateCoupon, fetchMyCoupons } 

export default orderService