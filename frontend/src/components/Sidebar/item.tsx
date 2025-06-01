import { ICollection } from "@/types"
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
// import { Badge } from "../ui/badge"

type SidebarItemProps = {
  collection: ICollection
  onClick?: () => void
  isActive?: boolean
}

const SidebarItem = ({ collection, onClick, isActive }: SidebarItemProps) => {
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
        {/* <Badge variant="secondary" className="ml-auto">
          {collection.count || 0}
        </Badge> */}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarItem
