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
import { useState } from "react"

type CreateCollectionDialogProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onCreate: (name: string, emoji: string) => void
}

const CreateCollectionDialog = ({
  isOpen,
  setIsOpen,
  onCreate
}: CreateCollectionDialogProps) => {
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionEmoji, setNewCollectionEmoji] = useState("📁")
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
          <DialogTitle>Create New Collection</DialogTitle>
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
              <div className="flex gap-1">
                {["📁", "📚", "🎨", "⚙️", "🎬", "📄", "💼", "🔗"].map(
                  (emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-lg"
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onCreate(newCollectionName, newCollectionEmoji)}
            disabled={!newCollectionName.trim()}
          >
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCollectionDialog
