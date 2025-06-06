import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Eye, Clock, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { PostService } from "@/services/PostService"
import { ICollection, PostCreateData } from "@/types"
import { CollectionService } from "@/services/CollectionService"
import { toast } from "sonner"
import { handleError } from "@/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const unCategorizedCollection: ICollection = {
  id: null,
  name: "Uncategorized",
  created_at: new Date().toISOString(),
  user_id: "",
  parent_id: null,
  icon: "📂",
  updated_at: new Date().toISOString(),
  deleted_at: null
}

export default function PostDetail() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isDirty, setIsDirty] = useState(false)
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const params = useParams()
  const postId =
    params.post_id && params.post_id !== "create" ? params.post_id : null
  const collectionId = searchParams.get("collection_id")
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

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: () =>
      PostService.getPost({
        id: postId || ""
      }),
    enabled: !!postId,
    refetchOnMount: false,
    refetchOnReconnect: false
  })

  const mutation = useMutation({
    mutationFn: (data: PostCreateData) => {
      return postId
        ? PostService.updatePost({
            id: postId,
            title: data.title,
            content: data.content,
            collectionId: data.collectionId,
            imageUrl: post?.data.image_url,
            link: post?.data.link
          })
        : PostService.createPost({
            title: data.title,
            content: data.content,
            collectionId: data.collectionId
          })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success(data.msg)
      // clear fields after saving
      setTitle("")
      setContent("")
      setSelectedCollection(null)
      // Navigate back to dashboard or posts list
      if (collectionId) {
        navigate(`/collection/${collectionId}`)
      } else {
        navigate("/")
      }
    },
    onError: (error) => {
      handleError(toast, error)
    }
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setIsDirty(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsDirty(true)
  }

  const handleSave = async () => {
    setIsDirty(false)
    mutation.mutate({
      title: title.trim(),
      content: content.trim(),
      collectionId: selectedCollection?.id || null
    })
  }

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
      if (!confirmLeave) return
    }

    if (collectionId) {
      navigate(`/collection/${collectionId}`)
    } else {
      navigate("/")
    }
  }

  const handlePreview = () => {
    // Handle preview logic here
    console.log("Opening preview")
  }

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const charCount = content.length

  useEffect(() => {
    if (error) {
      handleError(toast, error)
    }
  }, [error])

  useEffect(() => {
    const collectionId = searchParams.get("collection_id")
    if (collectionId) {
      const collection = collections?.data?.find(
        (collection) => collection.id === collectionId
      )
      setSelectedCollection(collection || unCategorizedCollection)
    }
  }, [collections?.data, navigate, searchParams])

  useEffect(() => {
    if (post && !isDirty) {
      setTitle(post.data.title || "")
      setContent(post.data.content || "")
      setSelectedCollection(
        collections?.data?.find(
          (collection) => collection.id === post.data.collection_id
        ) || unCategorizedCollection
      )
    }
  }, [post, collections?.data, isDirty])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-muted border-b border-current sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">
                  {postId ? "Edit Post" : "Create New Post"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Draft</span>
                  {isDirty && (
                    <Badge variant="secondary" className="text-xs">
                      Unsaved changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="hidden md:block"
                variant="outline"
                size="sm"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!content.trim()}>
                {mutation.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter your post title..."
                value={title}
                onChange={handleTitleChange}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Choose a clear and descriptive title for your post
              </p>
            </div>

            {/* Additional Options */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                    onChange={(e) => {
                      setSelectedCollection(
                        collections?.data.find(
                          (collection) => collection.id === e.target.value
                        ) || null
                      )
                      setIsDirty(true)
                    }}
                    value={selectedCollection?.id || ""}
                    defaultValue={unCategorizedCollection.id || ""}
                    disabled={isLoading}
                  >
                    {[
                      unCategorizedCollection,
                      ...(collections?.data || [])
                    ].map((collection) => (
                      <option key={collection.id} value={collection.id || ""}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-medium">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={handleContentChange}
                className="min-h-[400px] resize-none"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>Write your post content using markdown formatting</p>
                <div className="flex items-center gap-4">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons (Mobile) */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:hidden">
          <Button
            onClick={handleSave}
            disabled={!content.trim()}
            className="w-full"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Post
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel} className="w-full">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </main>
    </div>
  )
}
