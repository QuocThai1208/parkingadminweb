import apiAxios from "@/config/api/apiAxios"
import { ENDPOINTS } from "@/config/api/endpoints"

export const VehicleService = {
    getgetVehicles: async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.ADMIN.VEHICLES}?${params}`
        const res = await apiAxios.get(url)
        return res.data
    },
    handleApprove: async (id:string, params: URLSearchParams) => {
        const url = `${ENDPOINTS.ADMIN.APPROVED(id)}?${params}`
        const res = await apiAxios.post(url)
        return res.data
    },
}