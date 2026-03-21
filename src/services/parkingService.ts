import apiAxios from "@/config/api/apiAxios"
import { ENDPOINTS } from "@/config/api/endpoints"

export const ParkingService = {
    check_in: async (data: FormData) => {
        const res = await apiAxios.post(ENDPOINTS.PARKING.CHECK_IN, data)
        return res.data
    },
    check_out: async (data: FormData) => {
        const res = await apiAxios.post(ENDPOINTS.PARKING.CHECK_OUT, data)
        return res.data
    }
}