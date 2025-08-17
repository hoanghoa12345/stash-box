import { ICollection } from '@/types';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { MoreOptionMenu } from './menu';
import { cn } from '@/lib/utils';

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
      <SidebarMenuButton isActive={isActive} className="w-full justify-between">
        <div className="flex space-x-2 w-full" role="button" onClick={onClick}>
          <div className="flex size-6 items-center justify-center rounded">
            {collection.icon || '📄'}
          </div>
          <span className="flex-1 text-base md:text-sm">{collection.name}</span>
        </div>
        <div className="flex gap-1">
          <MoreOptionMenu
            className={cn(
              'opacity-0 group-hover/menu-item:opacity-100 transition-opacity duration-150 ease-in-out',
              isActive && 'opacity-100',
            )}
            onEdit={() => onEdit?.(collection)}
            onDelete={() => onDelete?.(collection)}
          />
          <div className="w-8 overflow-x-hidden text-right text-base px-1 md:text-sm text-muted-foreground">
            {collection.total_posts || 0}
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarItem;
