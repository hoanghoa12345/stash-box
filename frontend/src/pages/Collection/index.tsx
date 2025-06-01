import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Folder, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import PostService from "@/services/PostService"
import { ICollection, Post } from "@/types/index"
import AppSidebar from "@/components/Sidebar"
import AppHeader from "@/components/Header"

export enum PostType {
  POST_TYPE_TEXT = 1,
  POST_TYPE_LINK = 2
}

export default function Collection() {
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getPostByCollection()
  }, [])

  const getPostByCollection = async (collectionId?: string) => {
    try {
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
              <Card
                key={card.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {card.type === PostType.POST_TYPE_LINK && card.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={card.image_url || "/placeholder.svg"}
                      alt={card.title}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                <CardHeader
                  className={
                    card.type === PostType.POST_TYPE_LINK ? "pb-2" : "pb-3"
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                      {card.title}
                    </CardTitle>
                    {/* {card.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                    )} */}
                  </div>
                  <CardDescription className="text-sm line-clamp-2">
                    {card.content}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {card.type === PostType.POST_TYPE_TEXT ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{card.created_at}</span>
                        <span>•</span>
                        <span>{card.updated_at}</span>
                        <span>•</span>
                        <span>{card.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {card.collection_id}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Read {card.title}</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {/* {card.favicon && (
                          <img
                            src={card.favicon || "/placeholder.svg"}
                            alt=""
                            className="w-4 h-4"
                          />
                        )} */}
                        <span className="text-xs text-muted-foreground truncate">
                          {card.link}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {card.collection_id}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Visit {card.link}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
