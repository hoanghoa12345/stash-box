import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Folder } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom"
import AppSidebar from "@/components/Sidebar"
import AppHeader from "@/components/Header"
import LinkCard from "@/components/Card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PostService } from "@/services/PostService"
import { handleError } from "@/utils"
import { CollectionService } from "@/services/CollectionService"
import { DeleteAlert } from "@/components/Alert/DeleteAlert"

export default function Collection() {
  const navigate = useNavigate()
  const params = useParams()
  const collectionId = params.collection_id
  const queryClient = useQueryClient()
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ["posts", collectionId],
    queryFn: () =>
      PostService.getPosts({
        collectionId: collectionId || "",
        isUnCategorized: !collectionId ? true : false,
        filter: "",
        offset: -1,
        limit: 50
      })
  })

  const { data: collection } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () =>
      CollectionService.getCollection({
        id: collectionId || ""
      }),
    enabled: () => {
      if (collectionId && collectionId !== "null") {
        return true
      }
      return false
    }
  })

  const deleteMutation = useMutation({
    mutationFn: PostService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Post deleted successfully")
      setIsOpenDeleteAlert(false)
      setDeleteId("")
    },
    onError: () => {
      toast.error("Failed to delete post")
    }
  })

  const handleDeletePost = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId })
    }
  }

  useEffect(() => {
    if (error) {
      handleError(toast, error)
    }
  }, [error])

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppHeader selectedCollection={collection?.data} />

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-64 w-full rounded-lg" />
                ))}
              </>
            ) : (
              posts?.data.map((card) => (
                <LinkCard
                  card={card}
                  key={card.id}
                  onClick={() => {
                    navigate(
                      `/post/${card.id}?collection_id=${card.collection_id}`
                    )
                  }}
                  onDelete={() => {
                    setIsOpenDeleteAlert(true)
                    setDeleteId(card.id)
                  }}
                />
              ))
            )}
          </div>

          {posts?.data.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Folder className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No items in this collection
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by adding some resources to this collection.
              </p>
              <Button
                onClick={() =>
                  navigate(
                    `/p/create?collection_id=${
                      collection?.data?.id || collectionId
                    }`
                  )
                }
              >
                Add Item
              </Button>
            </div>
          ) : null}
          <DeleteAlert
            isOpen={isOpenDeleteAlert}
            onOpenChange={() => setIsOpenDeleteAlert(!isOpenDeleteAlert)}
            onConfirm={handleDeletePost}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
