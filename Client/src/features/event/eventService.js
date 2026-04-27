import axios from "axios"

const API_URL = "/api/events"

const fetchEvents = async () => {

    const response = await axios.get(API_URL)

     return response.data

}


const eventService = {fetchEvents}

export default eventService