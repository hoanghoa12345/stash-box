import { useEffect } from "react"
import { SidebarTrigger } from "../ui/sidebar"
import { Button } from "../ui/button"
import { CirclePlus } from "lucide-react"
import { ICollection } from "@/types"
import UserMenu from "./user"
import { AuthService } from "@/services/AuthService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { handleError } from "@/utils"

type AppHeaderProps = {
  selectedCollection: ICollection | null
}

const AppHeader = ({ selectedCollection }: AppHeaderProps) => {
  const navigate = useNavigate()

  const {
    data: user,
    isError,
    error
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => AuthService.getUser(),
    retry: false
  })

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
    navigate("/p/create")
  }

  useEffect(() => {
    if (isError) {
      handleError(toast, error)
      navigate("/login")
    }
  }, [error, isError, navigate])

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
          userName={user?.data.email?.split("@")[0]}
          userEmail={user?.data.email}
          onLogout={handleLogout}
          // userProfilePicture={user?.profilePicture}
        />
      </div>
    </header>
  )
}

export default AppHeader
