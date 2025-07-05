import { useAuth } from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"
import logo from "@/assets/logo.svg"

const MainLayout = () => {
  const { user, token, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-16 mb-4" />
        </div>
      </div>
    )
  }
  if (!user && !token) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}

export default MainLayout
