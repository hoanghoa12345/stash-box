import { SidebarTrigger } from "../ui/sidebar"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { ICollection } from "@/types"
import UserMenu from "./user"
import { AuthService } from "@/services/AuthService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { handleError } from "@/utils"
import { useAuth } from "@/hooks/useAuth"

type AppHeaderProps = {
  selectedCollection?: ICollection | null
}

const AppHeader = ({ selectedCollection }: AppHeaderProps) => {
  const navigate = useNavigate()

  const { user } = useAuth()

  const mutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      navigate("/login")
    },
    onError: (error) => {
      handleError(toast, error)
      navigate("/login")
    }
  })

  const handleLogout = async () => {
    mutation.mutate()
  }

  const navigateToCreatePost = () => {
    const searchParams = new URLSearchParams(window.location.search)
    if (selectedCollection?.id) {
      searchParams.set("collection_id", selectedCollection?.id || "")
    }
    navigate({
      pathname: "/post/create",
      search: searchParams.toString()
    })
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b sticky top-0 z-50 -mb-4 px-4 bg-background">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2">
        <div className={`flex size-8 items-center justify-center rounded`}>
          {selectedCollection?.icon}
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{selectedCollection?.name}</h1>
          {selectedCollection?.total_posts ? (
            <p className="text-sm text-muted-foreground">
              {selectedCollection.total_posts} items
            </p>
          ) : null}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="default" onClick={navigateToCreatePost}>
          <Plus className="!size-5" />
          <span className="text-base">New</span>
        </Button>
        <UserMenu
          userName={user?.name}
          userEmail={user?.email}
          onLogout={handleLogout}
          userProfilePicture={user?.picture}
        />
      </div>
    </header>
  )
}

export default AppHeader
