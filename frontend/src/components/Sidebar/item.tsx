import { ICollection } from "@/types"
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Badge } from "../ui/badge"
import { MoreOptionMenu } from "./menu"

type SidebarItemProps = {
  collection: ICollection
  onClick?: () => void
  isActive?: boolean
  onEdit?: (collection: ICollection) => void
  onDelete?: (collection: ICollection) => void
}

const SidebarItem = ({
  collection,
  isActive,
  onClick,
  onEdit,
  onDelete
}: SidebarItemProps) => {
  return (
    <SidebarMenuItem key={collection.id}>
      <SidebarMenuButton
        onClick={onClick}
        isActive={isActive}
        className="w-full justify-start"
      >
        <div className="flex size-6 items-center justify-center rounded">
          {collection.icon || "📄"}
        </div>
        <span className="flex-1">{collection.name}</span>
        <MoreOptionMenu
          onEdit={() => onEdit?.(collection)}
          onDelete={() => onDelete?.(collection)}
        />
        <Badge variant="secondary" className="ml-auto">
          {collection.total_posts || 0}
        </Badge>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarItem
