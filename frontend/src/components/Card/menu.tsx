import { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionMenuItem } from '@/components/ui/dropdown-menu-item';
import { MoreVertical, Pencil, RefreshCwIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoreOptionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onRefreshMetadata: () => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  className?: string;
  align?: 'start' | 'end' | 'center';
  side?: 'top' | 'right' | 'bottom' | 'left';
  id?: string;
}

export const MoreOptionMenu: FC<MoreOptionMenuProps> = ({
  onEdit,
  onDelete,
  onRefreshMetadata,
  editDisabled = false,
  deleteDisabled = false,
  className,
  align = 'end',
  side = 'bottom',
  id,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id={id}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50',
          className,
        )}
        aria-label="Open menu"
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="min-w-[160px]">
        {onEdit && (
          <ActionMenuItem
            onSelect={onEdit}
            disabled={editDisabled}
            icon={<Pencil className="h-4 w-4" />}
          >
            Edit
          </ActionMenuItem>
        )}
        <ActionMenuItem
          onSelect={onRefreshMetadata}
          icon={<RefreshCwIcon className="h-4 w-4" />}
        >
          Refetch metadata
        </ActionMenuItem>
        <DropdownMenuSeparator className="bg-border -mx-1 my-1 h-px" />
        {onDelete && (
          <ActionMenuItem
            onSelect={onDelete}
            destructive
            disabled={deleteDisabled}
            icon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </ActionMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
