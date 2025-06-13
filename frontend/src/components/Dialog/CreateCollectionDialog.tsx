import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { ICollection, UpsetCollection } from "@/types"

type CreateCollectionDialogProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: ({ name, icon, collectionId }: UpsetCollection) => void
  initialData?: ICollection | null
}

const CreateCollectionDialog = ({
  isOpen,
  setIsOpen,
  onSubmit,
  initialData
}: CreateCollectionDialogProps) => {
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionEmoji, setNewCollectionEmoji] = useState("📁")
  useEffect(() => {
    setNewCollectionName(initialData?.name || "")
    setNewCollectionEmoji(initialData?.icon || "📁")
  }, [initialData])
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create new collection</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Collection" : "Create New Collection"}
          </DialogTitle>
          <DialogDescription>
            Add a new collection to organize your resources. Choose a name and
            an emoji icon.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Enter collection name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emoji" className="text-right">
              Icon
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="emoji"
                value={newCollectionEmoji}
                onChange={(e) => setNewCollectionEmoji(e.target.value)}
                placeholder="📁"
                className="w-16 text-center text-lg"
                maxLength={2}
              />
              <div className="flex gap-1 overflow-x-auto">
                {["📁", "📚", "🎨", "⚙️", "🎬", "📄", "💼", "🔗"].map(
                  (emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-2 py-0 text-lg"
                      onClick={() => setNewCollectionEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() =>
                onSubmit({
                  name: newCollectionName,
                  icon: newCollectionEmoji,
                  collectionId: initialData?.id
                })
              }
              disabled={!newCollectionName.trim()}
            >
              {initialData ? "Update Collection" : "Create Collection"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCollectionDialog
