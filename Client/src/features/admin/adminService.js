import api from "../../utils/axiosConfig";

const fetchAllUsers = async () => {
    const response = await api.get("/admin/users")
    return response.data 
}

const fetchAllEvents = async () => {
    const response = await api.get("/admin/events")
    return response.data 
};

const fetchAllOrders = async () => {
    const response = await api.get("/admin/orders")
    return response.data 
};

const fetchAllRatings = async () => {
    const response = await api.get("/admin/ratings")
    return response.data 
};

const fetchAllCoupons = async () => {
    const response = await api.get("/admin/coupons")
    return response.data 
};

export const adminService = {
  fetchAllUsers,
  fetchAllEvents,
  fetchAllOrders,
  fetchAllRatings,
  fetchAllCoupons,
};

export default adminService
