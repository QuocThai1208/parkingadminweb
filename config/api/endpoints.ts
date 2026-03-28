export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login"
    },
    ADMIN: {
        LOGS_HISTORY: "/admin/history",
        LOGS: "/admin/parking-logs",
        VEHICLES: "/admin/vehicles",
        APPROVED: (id:string) => `/admin/vehicles/${id}/is_approved-change`
    },
    PARKING: {
        CHECK_IN: "/parking/check-in",
        CHECK_OUT: "/parking/check-out",
    },
    LOGS: {
        
    },
    EMPLOYEES: {
        GET_EMPLOYEES: "/admin/employees",
        UPDATE_EMPLOYEE:(id:string) => `/employees/${id}`,
        UPDATE_EMPLOYEE_ACTIVE:(id:string) => `/employees/${id}/active`,
        MANAGE_REGISTER: "/admin/manage/register",
        STAFF_REGISTER: "/admin/staff/register"
    },
    CUSTOMER: {
        GET_CUSTOMERS: "/admin/customers",
    },
    VEHICLES: {

    },
    FEE_RULE: {
        FEE_RULES: "/fee-roles",
        DETAIL:(id:string) =>  `/fee-roles/${id}`
    },
    ANALYTICS: {
        TOTAL_REVENUE: "/stats/revenue",
        REVENUE_COMPARE: "/stats/revenue/compare",
        REVENUE_BY_USER: "/stats/revenue/by-user",
        PARKING_LOGS_COMPARE: "/stats/parking-logs/compare",
        PEAK: `/stats/parking/peak-hours`,
        OCCUPIED: `/stats/parking/current`,
        DATA_CHART: `/stats/revenue/chart`,
        PEAK_HOURS: "/stats/parking/peak-hours",
        REVENUE_BY_VEHICLE_TYPE: "/stats/revenue/by-type-vehicle"
    }
    


} as const;