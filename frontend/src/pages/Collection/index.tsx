import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Folder } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { ICollection } from "@/types/index"
import AppSidebar from "@/components/Sidebar"
import AppHeader from "@/components/Header"
import LinkCard from "@/components/Card"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { PostService } from "@/services/PostService"
import { handleError } from "@/utils"

export default function Collection() {
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null)
  const navigate = useNavigate()

  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ["posts", selectedCollection?.id],
    queryFn: () =>
      PostService.getPosts({
        collectionId: selectedCollection?.id || "",
        isUnCategorized: false,
        filter: "",
        offset: -1,
        limit: 50
      })
  })

  useEffect(() => {
    if (error) {
      handleError(toast, error)
    }
  }, [error])

  return (
    <SidebarProvider>
      <AppSidebar
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
      />

      <SidebarInset>
        <AppHeader selectedCollection={selectedCollection} />

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
                    navigate(`/post/${card.id}`)
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
              <Button>Add Item</Button>
            </div>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
