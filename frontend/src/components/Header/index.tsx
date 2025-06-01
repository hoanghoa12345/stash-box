import React, { useEffect, useState } from "react"
import { SidebarTrigger } from "../ui/sidebar"
import { Button } from "../ui/button"
import { Calendar, CirclePlus, Star } from "lucide-react"
import { ICollection, User } from "@/types"
import UserMenu from "./user"
import AuthService from "@/services/AuthService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

type AppHeaderProps = {
  selectedCollection: ICollection | null
}

const AppHeader = ({ selectedCollection }: AppHeaderProps) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const getUserProfile = async () => {
    try {
      const userProfile = await AuthService.getUserData()
      setUser(userProfile.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
      navigate("/login")
    }
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      navigate("/login")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred while logging out")
      }
    }
  }

  const navigateToCreatePost = () => {
    navigate("/p/create")
  }

  useEffect(() => {
    getUserProfile()
  }, [navigate])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2">
        <div className={`flex size-8 items-center justify-center rounded`}>
          {selectedCollection?.icon || "📂"}
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">
            {selectedCollection?.name || "Uncategorized"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {/* {selectedCollection.count} items */}
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={navigateToCreatePost}>
          <CirclePlus className="size-4 mr-2" />
          Create
        </Button>
        {/* <Button variant="outline" size="sm">
          <Calendar className="size-4 mr-2" />
          Recent
        </Button> */}
        <UserMenu
          userName={user?.email?.split("@")[0]}
          userEmail={user?.email}
          onLogout={handleLogout}
          // userProfilePicture={user?.profilePicture}
        />
      </div>
    </header>
  )
}

export default AppHeader
