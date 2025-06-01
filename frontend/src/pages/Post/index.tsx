import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Eye, Clock } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PostService from "@/services/PostService"

export default function PostDetail() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isDirty, setIsDirty] = useState(false)
  const navigate = useNavigate()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setIsDirty(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsDirty(true)
  }

  const handleSave = async () => {
    // Handle save logic here
    console.log("Saving post:", { title, content })
    setIsDirty(false)
    const result = await PostService.createPost({
      title: title.trim(),
      content: content.trim()
    })
    // if (result.error) {
    //   console.error("Error saving post:", result.error)
    //   alert("Failed to save post. Please try again.")
    //   return
    // }
    console.log("Post saved successfully:", result.data)
    // You could redirect to dashboard or show success message
  }

  const handleCancel = () => {
    // Handle cancel logic here
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
      if (!confirmLeave) return
    }
    // Navigate back to dashboard
    console.log("Cancelling post creation")
    navigate("/")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Create New Post</h1>
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
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Post
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

            {/* Additional Options */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="documentation">Documentation</option>
                    <option value="marketing">Marketing</option>
                    <option value="research">Research</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="Add tags separated by commas"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons (Mobile) */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:hidden">
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Post
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
