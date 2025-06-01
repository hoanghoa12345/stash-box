import Collection from "@/pages/Collection"
import Login from "@/pages/Login"
import PostDetail from "@/pages/Post"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
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
])

export default router
