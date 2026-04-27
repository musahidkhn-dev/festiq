import axios from "axios";

const API_URL = '/api/admin'

const fetchAllUsers = async (token) => {
 

  let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

  
    const response = await axios.get(API_URL + "/users", options)
    return response.data 
}
const fetchAllEvents = async (token) => {
 
  let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    console.log("Fetching Events");
};

const fetchAllOrders = async (token) => {
 
  let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    console.log("Fetching Orders");
};

const fetchAllRatings = async (token) => {
 
  let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    console.log("Fetching Ratings");
};

const fetchAllCoupons = async (token) => {
 
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
 

};

export const adminService = {
  fetchAllUsers,
  fetchAllEvents,
  fetchAllOrders,
  fetchAllRatings,
  fetchAllCoupons,
};

export default adminService
