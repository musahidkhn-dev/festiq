import axios from "axios"

let API_URL = "/api/order"

const fetchTickets = async (token) => {

    let options = {
        headers : {
            Authorization : `Bearer ${token}`
        }
    }
    // console.log("TOKEN:", token)

    const response = await axios.get(API_URL, options)
    // consol   e.log(response.data)
    return response.data
     
}


// const fetchTicket = (tid, token) => {}

// const bookTicket = (formData, token) => {}

//  const cancelTicket = (tid, token) => {}

 const orderService = {fetchTickets} 

 export default orderService