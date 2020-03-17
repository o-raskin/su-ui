import Axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8099'

export default Axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})