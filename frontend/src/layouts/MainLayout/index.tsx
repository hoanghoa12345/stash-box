import Spinner from "@/components/Spinner"
import { useAuth } from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

const MainLayout = () => {
  const { isLoading, isAuthenticated } = useAuth()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}

export default MainLayout
