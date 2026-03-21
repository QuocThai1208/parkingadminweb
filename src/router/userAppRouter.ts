import { useRouter } from "next/navigation"

export const useAppRouter = () => {
    const router = useRouter()

    const goToDashBoard = () => {
        router.push("/dashboard")
    }

    return {
        goToDashBoard
    }
}