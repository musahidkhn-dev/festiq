import api from "../../utils/axiosConfig";

const fetchAllUsers = async (params) => {
    const response = await api.get("/admin/users", { params })
    return response.data 
}

const fetchUserDetails = async (uid) => {
    const response = await api.get(`/admin/users/${uid}/details`)
    return response.data 
}

const fetchAllEvents = async (params) => {
    const response = await api.get("/admin/events", { params })
    return response.data 
};

const deleteEvent = async (eid) => {
  const response = await api.delete(`/admin/events/${eid}`);
  return response.data;
};

const updateEvent = async (eid, eventData) => {
  const response = await api.put(`/admin/events/${eid}`, eventData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const fetchAllOrders = async (params) => {
    const response = await api.get("/admin/orders", { params })
    return response.data 
};

const fetchAllRatings = async () => {
    const response = await api.get("/admin/ratings")
    return response.data 
};

const fetchAllCoupons = async () => {
  const response = await api.get("/admin/coupons");
  return response.data;
};

const createCoupon = async (couponData) => {
  const response = await api.post("/admin/coupons", couponData);
  return response.data;
};

const updateCoupon = async (cid, couponData) => {
  const response = await api.put(`/admin/coupons/${cid}`, couponData);
  return response.data;
};

const updateUser = async (uid, userData) => {
  const response = await api.put(`/admin/users/${uid}`, userData);
  return response.data;
};

const deleteUser = async (uid) => {
  const response = await api.delete(`/admin/users/${uid}`);
  return response.data;
};

const updateOrderStatus = async (oid, orderData) => {
  const response = await api.put(`/admin/orders/${oid}`, orderData);
  return response.data;
};

const deleteOrder = async (oid) => {
  const response = await api.delete(`/admin/orders/${oid}`);
  return response.data;
};

const deleteCoupon = async (cid) => {
  const response = await api.delete(`/admin/coupons/${cid}`);
  return response.data;
};

const fetchAllAnalytics = async () => {
  const response = await api.get("/admin/analytics");
  return response.data;
};

const assignCoupon = async ({ couponId, userId }) => {
  const response = await api.post("/admin/coupons/assign", { couponId, userId });
  return response.data;
};

export const adminService = {
  fetchAllUsers,
  fetchUserDetails,
  fetchAllEvents,
  updateEvent,
  deleteEvent,
  fetchAllOrders,
  fetchAllRatings,
  fetchAllCoupons,
  createCoupon,
  updateCoupon,
  updateUser,
  deleteUser,
  updateOrderStatus,
  deleteOrder,
  deleteCoupon,
  fetchAllAnalytics,
  assignCoupon,
};

export default adminService
