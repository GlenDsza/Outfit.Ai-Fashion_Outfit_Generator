import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://decent-slightly-aphid.ngrok-free.app",
})

export const vogue_trending = async()=>{
    try {
        const response = await axiosInstance.post('/vogue_trending')
        return response.data

    } catch (error) {
        return error.response.data
    }
}
