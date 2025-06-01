import Collection from "@/pages/Collection"
import Login from "@/pages/Login"
import PostDetail from "@/pages/Post"
import { createHashRouter } from "react-router-dom"

const router = createHashRouter(
  [
    {
      index: true,
      element: <Collection />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/p/:post_id",
      element: <PostDetail />
    }
  ],
  {
    basename: import.meta.env.VITE_BASE_URL || ""
  }
)

export default router
