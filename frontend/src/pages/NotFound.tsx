import React from "react"
import { useNavigate } from "react-router-dom"

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-primary mb-8">Page not found</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition-colors"
      >
        Go Home
      </button>
    </div>
  )
}

export default NotFoundPage
