import apiAxios from "@/config/api/apiAxios"
import { ENDPOINTS } from "@/config/api/endpoints"

export const EmployeesService = {
    getEmployees: async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.EMPLOYEES.GET_EMPLOYEES}?${params}`
        const res = await apiAxios.get(url)
        return res.data
    },
    getCustomers: async (params: URLSearchParams) => {
        const url = `${ENDPOINTS.CUSTOMER.GET_CUSTOMERS}?${params}`
        const res = await apiAxios.get(url)
        return res.data
    },
    updateEmployees: async (data: FormData, id: string) => {
        const res = await apiAxios.patch(ENDPOINTS.EMPLOYEES.UPDATE_EMPLOYEE(id), data)
        return res.data
    },
    updateEmployeesActive: async (is_active: boolean, id: string) => {
        const res = await apiAxios.patch(ENDPOINTS.EMPLOYEES.UPDATE_EMPLOYEE_ACTIVE(id), {is_active})
        return res.data
    },
    manage_register: async (data: FormData) => {
        const res = await apiAxios.post(ENDPOINTS.EMPLOYEES.MANAGE_REGISTER, data)
        return res.data
    },
    staff_register: async (data: FormData) => {
        const res = await apiAxios.post(ENDPOINTS.EMPLOYEES.STAFF_REGISTER, data)
        return res.data
    },
}