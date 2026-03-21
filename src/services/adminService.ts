import apiAxios from "@/config/api/apiAxios"
import { ENDPOINTS } from "@/config/api/endpoints"

export const AdminService = {
    get_logs_history: async () => {
        const res = await apiAxios.get(ENDPOINTS.ADMIN.LOGS_HISTORY)
        return res.data
    },
    get_logs:async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.ADMIN.LOGS}?${params.toString()}`
        const res = await apiAxios.get(url)
        return res.data
    },
}