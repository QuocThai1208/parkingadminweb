import apiAxios from "@/config/api/apiAxios"
import { ENDPOINTS } from "@/config/api/endpoints"
import { ParkingSlot } from "@/lib/parking-slot-type"

export const ParkingLotsService = {
    getParkingLots: async() => {
        const res = await apiAxios.get(ENDPOINTS.PARKING_LOTS.MY_LOTS)
        return res.data
    }, 
    getParkingLotDetail: async(id:string) => {
        const res = await apiAxios.get(ENDPOINTS.PARKING_LOTS.LOTS_DETAIL(id))
        return res.data
    }, 
    uploadFullMap: async(id:number, mapInfo: any, slots: ParkingSlot[]) => {
        const data = new FormData();
        data.append('floor', mapInfo.floor);
        data.append('floor_display', mapInfo.floor_display);

        if (mapInfo.map_svg) {data.append('map_svg', mapInfo.map_svg);} //đối tượng File/Blob

        data.append('slots', JSON.stringify(slots));

        const res = await apiAxios.post(ENDPOINTS.PARKING_LOTS.UPLOAD_FULL_MAP(id), data)
        return res.data
    }
}