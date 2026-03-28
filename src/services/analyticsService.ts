import apiAxios from "@/config/api/apiAxios"
import { ENDPOINTS } from "@/config/api/endpoints"

export const AnalyticsService = {
    refresh_peak: async () => {
        const res = await apiAxios.get(ENDPOINTS.ANALYTICS.PEAK)
        return res.data
    },
    refresh_occupied: async () => {
        const res = await apiAxios.get(ENDPOINTS.ANALYTICS.OCCUPIED)
        return res.data
    },
    refresh_data_chart: async () => {
        const res = await apiAxios.get(ENDPOINTS.ANALYTICS.DATA_CHART)
        return res.data
    },
    get_total_revenue: async () => {
        const res = await apiAxios.get(ENDPOINTS.ANALYTICS.TOTAL_REVENUE)
        return res.data
    },
    get_revenue_compare: async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.ANALYTICS.REVENUE_COMPARE}?${params}`
        const res = await apiAxios.get(url)
        return res.data
    },
    get_revenue_by_user: async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.ANALYTICS.REVENUE_BY_USER}?${params}`
        const res = await apiAxios.get(url)
        return res.data
    },
    get_parking_log_compare: async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.ANALYTICS.PARKING_LOGS_COMPARE}?${params}`
        const res = await apiAxios.get(url)
        return res.data
    },
    get_peak_hours: async () => {
        const res = await apiAxios.get(ENDPOINTS.ANALYTICS.PEAK_HOURS)
        return res.data
    },
    get_revenue_by_vehicle_type: async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.ANALYTICS.REVENUE_BY_VEHICLE_TYPE}?${params}`
        const res = await apiAxios.get(url)
        return res.data
    },

}