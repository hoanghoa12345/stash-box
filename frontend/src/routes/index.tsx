import MainLayout from "@/layouts/MainLayout"
import Collection from "@/pages/Collection"
import Login from "@/pages/Login"
import NotFoundPage from "@/pages/NotFound"
import PostDetail from "@/pages/Post"
import Settings from "@/pages/Settings"
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
          path: "/collection/:collection_id",
          element: <Collection />
        },
        {
          path: "/post/:post_id",
          element: <PostDetail />
        },
        {
          path: "/post/:post_id/edit",
          element: <PostDetail />
        },
        {
          path: "/settings",
          element: <Settings />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "*",
      element: <NotFoundPage />
    }
  ],
  {
    basename: import.meta.env.VITE_BASE_URL || ""
  }
)

export default router
