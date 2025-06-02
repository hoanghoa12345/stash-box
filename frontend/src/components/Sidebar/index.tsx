import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Folder } from "lucide-react"
import { ICollection } from "@/types"
import { toast } from "sonner"
import SidebarItem from "./item"
import { Skeleton } from "../ui/skeleton"
import CreateCollectionDialog from "../Dialog/CreateCollectionDialog"
import { CollectionService } from "@/services/collection"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const unCategorized: ICollection = {
  id: null,
  name: "Uncategorized",
  created_at: new Date().toISOString(),
  user_id: "",
  parent_id: null,
  icon: "📂",
  updated_at: new Date().toISOString(),
  deleted_at: null
}

type AppSidebarProps = {
  selectedCollection?: ICollection | null
  setSelectedCollection?: (collection: ICollection | null) => void
}

const AppSidebar = ({
  selectedCollection,
  setSelectedCollection
}: AppSidebarProps) => {
  const queryClient = useQueryClient()
  const {
    data: collections,
    error,
    isLoading
  } = useQuery({
    queryKey: ["collections"],
    queryFn: () =>
      CollectionService.getCollections({
        offset: -1,
        limit: 50
      })
  })
  const mutation = useMutation({
    mutationFn: CollectionService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      toast.success("Collection created successfully")
      setIsCreateModalOpen(false)
    },
    onError: () => {
      toast.error("Failed to create collection")
    }
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const handleCreateCollection = async (name: string, emoji: string) => {
    if (!name.trim()) {
      toast.error("Collection name cannot be empty")
      return
    }

    mutation.mutate({
      name,
      icon: emoji
    })
  }

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

  if (isLoading) {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Folder className="size-4" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-2 w-24" />
            </div>
          </div>
        </SidebarHeader>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Folder className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Collections</span>
            <span className="text-xs text-muted-foreground">
              Organize your resources
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Your Collections</SidebarGroupLabel>
            <CreateCollectionDialog
              isOpen={isCreateModalOpen}
              setIsOpen={setIsCreateModalOpen}
              onCreate={handleCreateCollection}
            />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <SidebarMenuItem className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </SidebarMenuItem>
              ) : collections?.data.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full justify-center">
                    No collections found. Please create one.
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                [unCategorized, ...(collections?.data ?? [])].map(
                  (collection) => (
                    <SidebarItem
                      key={collection.id}
                      collection={collection}
                      onClick={() => setSelectedCollection?.(collection)}
                      isActive={
                        selectedCollection?.id === collection.id ||
                        (selectedCollection === null && collection.id === null)
                      }
                    />
                  )
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
