import { AuthService } from "@/services/AuthService"
import { handleError } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useAuth = () => {
  const navigate = useNavigate()
  const {
    data: user,
    isError,
    error,
    isLoading,
    isSuccess: isAuthenticated
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => AuthService.getUser(),
    retry: false
  })

  useEffect(() => {
    if (isError) {
      handleError(toast, error)
      navigate("/login")
    }
  }, [error, isError, navigate])

  return {
    user,
    isLoading,
    isAuthenticated,
    isError,
    error
  }
}
