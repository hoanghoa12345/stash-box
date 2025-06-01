import { Button } from "@/components/ui/button"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Folder } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import PostService from "@/services/PostService"
import { ICollection, Post } from "@/types/index"
import AppSidebar from "@/components/Sidebar"
import AppHeader from "@/components/Header"
import LinkCard from "@/components/Card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Collection() {
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    getPostByCollection()
  }, [])

  const getPostByCollection = async (collectionId?: string) => {
    try {
      setIsLoading(true)
      const response = await PostService.getPosts({
        collectionId: collectionId,
        isUnCategorized: false,
        filter: "",
        offset: -1,
        limit: 50
      })
      setPosts(response.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred while fetching posts")
      }
    } finally {
      setIsLoading(false)
    }
  }

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
            {posts.map((card) => (
              <LinkCard
                card={card}
                key={card.id}
                onClick={() => {
                  navigate(`/post/${card.id}`)
                }}
              />
            ))}
            {isLoading && (
              <>
                <Skeleton className="h-64 w-full md:w-1/2 lg:w-1/3 xl:w-1/4" />
                <Skeleton className="h-64 w-full md:w-1/2 lg:w-1/3 xl:w-1/4" />
                <Skeleton className="h-64 w-full md:w-1/2 lg:w-1/3 xl:w-1/4" />
                <Skeleton className="h-64 w-full md:w-1/2 lg:w-1/3 xl:w-1/4" />
              </>
            )}
          </div>

          {posts.length === 0 && (
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
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
