import { useRouter } from "next/navigation"

export const useAppRouter = () => {
    const router = useRouter()

    const goToDashBoard = () => {
        router.push("/dashboard")
    }

    const goToLogin = () => {
        router.push("/login")
    }

    return {
        goToDashBoard,
        goToLogin
    }
}