import MainLayout from "@/layouts/MainLayout"
import Collection from "@/pages/Collection"
import Login from "@/pages/Login"
import PostDetail from "@/pages/Post"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Collection />
        },
        {
          path: "/p/:post_id",
          element: <PostDetail />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    }
  ],
  {
    basename: import.meta.env.VITE_BASE_URL || ""
  }
)

export default router
