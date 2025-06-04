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
import { ICollection, UpsetCollection } from "@/types"
import { toast } from "sonner"
import SidebarItem from "./item"
import { Skeleton } from "../ui/skeleton"
import CreateCollectionDialog from "../Dialog/CreateCollectionDialog"
import { CollectionService } from "@/services/CollectionService"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { handleError } from "@/utils"
import { DeleteAlert } from "../Alert/DeleteAlert"
import { useNavigate } from "react-router-dom"

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

const AppSidebar = () => {
  const queryClient = useQueryClient()
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null)
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false)
  const [editedCollection, setEditedCollection] = useState<ICollection | null>(
    null
  )
  const navigate = useNavigate()
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
    mutationFn: ({ name, icon, collectionId }: UpsetCollection) =>
      collectionId
        ? CollectionService.updateCollection({
            id: collectionId,
            name,
            icon
          })
        : CollectionService.createCollection({
            name,
            icon
          }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      toast.success(data.msg)
      setIsCreateModalOpen(false)
      setEditedCollection(null)
    },
    onError: (error) => {
      handleError(toast, error)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: CollectionService.removeCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      toast.success("Collection deleted successfully")
      setIsOpenDeleteAlert(false)
      setSelectedCollection?.(null)
    },
    onError: () => {
      toast.error("Failed to delete collection")
    }
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const handleCreateCollection = async ({
    name,
    icon,
    collectionId
  }: UpsetCollection) => {
    if (!name.trim()) {
      toast.error("Collection name cannot be empty")
      return
    }

    mutation.mutate({
      name,
      icon,
      collectionId
    })
  }

  const handleNavigateCollection = (collection: ICollection) => {
    setSelectedCollection?.(collection)
    if (collection.id === unCategorized.id) {
      navigate("/")
      return
    }
    navigate(`/collection/${collection.id}`)
  }

  const handleEditCollection = (collection: ICollection) => {
    setEditedCollection(collection)
    setIsCreateModalOpen(true)
  }

  const handleDeleteCollection = (collection: ICollection) => {
    setSelectedCollection?.(collection)
    setIsOpenDeleteAlert(true)
  }

  useEffect(() => {
    if (error) {
      handleError(toast, error)
    }
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
    <>
      <Sidebar>
        <SidebarHeader className="bg-background">
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
        <SidebarContent className="bg-background">
          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Your Collections</SidebarGroupLabel>
              <CreateCollectionDialog
                isOpen={isCreateModalOpen}
                setIsOpen={setIsCreateModalOpen}
                onSubmit={handleCreateCollection}
                initialData={editedCollection}
              />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {collections?.data.length === 0 ? (
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
                        onClick={() => handleNavigateCollection(collection)}
                        isActive={
                          selectedCollection?.id === collection.id ||
                          (selectedCollection === null &&
                            collection.id === null)
                        }
                        onEdit={handleEditCollection}
                        onDelete={handleDeleteCollection}
                      />
                    )
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <DeleteAlert
        isOpen={isOpenDeleteAlert}
        onOpenChange={setIsOpenDeleteAlert}
        onConfirm={() => {
          if (selectedCollection?.id)
            deleteMutation.mutate({ id: selectedCollection.id })
        }}
      />
    </>
  )
}

export default AppSidebar
