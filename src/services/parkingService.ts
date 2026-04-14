import apiAxios from "@/config/api/apiAxios";
import { ENDPOINTS } from "@/config/api/endpoints";
import { ParkingFee } from "@/lib/parking-fee-data";

export const ParkingService = {
  check_in: async (data: FormData) => {
    const res = await apiAxios.post(ENDPOINTS.PARKING.CHECK_IN, data);
    return res.data;
  },
  check_out: async (data: FormData) => {
    const res = await apiAxios.post(ENDPOINTS.PARKING.CHECK_OUT, data);
    return res.data;
  },
  get_fee_rule: async (params: URLSearchParams) => {
    const res = await apiAxios.get(ENDPOINTS.FEE_RULE.FEE_RULES, { params });
    return res.data;
  },
  updateFeeActive: async (id: string, active: boolean, params: URLSearchParams) => {
    const res = await apiAxios.patch(ENDPOINTS.FEE_RULE.DETAIL(id), { active }, { params });
    return res.data;
  },
  updateFee: async (id: string, updatedFee: Omit<ParkingFee, "id">, params: URLSearchParams) => {
    const res = await apiAxios.put(ENDPOINTS.FEE_RULE.DETAIL(id), updatedFee, { params });
    return res.data;
  },
  createFee: async (updatedFee: Omit<ParkingFee, "id">, params: URLSearchParams) => {
    const res = await apiAxios.post(ENDPOINTS.FEE_RULE.FEE_RULES, updatedFee, { params });
    return res.data;
  },
};
