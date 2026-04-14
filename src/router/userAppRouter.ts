import { useRouter } from "next/navigation"

export const useAppRouter = () => {
    const router = useRouter()

    const goToDashBoard = () => {
        router.push("/dashboard")
    }

    const goToLogin = () => {
        router.push("/login")
    }

    const goToSelectParkingLot = () => {
        router.push("/select-parkinglot")
    }

    return {
        goToDashBoard,
        goToLogin,
        goToSelectParkingLot
    }
}