import { ICollection } from '@/types';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { Badge } from '../ui/badge';
import { MoreOptionMenu } from './menu';

type SidebarItemProps = {
  collection: ICollection;
  onClick?: () => void;
  isActive?: boolean;
  onEdit?: (collection: ICollection) => void;
  onDelete?: (collection: ICollection) => void;
};

const SidebarItem = ({
  collection,
  isActive,
  onClick,
  onEdit,
  onDelete,
}: SidebarItemProps) => {
  return (
    <SidebarMenuItem key={collection.id}>
      <SidebarMenuButton
        isActive={isActive}
        className="group w-full justify-between"
      >
        <div className="flex space-x-2 w-full" role="button" onClick={onClick}>
          <div className="flex size-6 items-center justify-center rounded">
            {collection.icon || '📄'}
          </div>
          <span className="flex-1">{collection.name}</span>
        </div>
        <div className="flex space-x-2 w-16">
          <MoreOptionMenu
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            onEdit={() => onEdit?.(collection)}
            onDelete={() => onDelete?.(collection)}
          />
          <Badge variant="secondary" className="ml-auto">
            {collection.total_posts || 0}
          </Badge>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarItem;
