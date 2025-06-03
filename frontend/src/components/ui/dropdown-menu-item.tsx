import { cn } from "@/lib/utils"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ReactNode } from "react"

interface ActionMenuItemProps {
  children: ReactNode
  className?: string
  destructive?: boolean
  disabled?: boolean
  onSelect?: () => void
  icon?: ReactNode
}

export function ActionMenuItem({
  children,
  className,
  destructive = false,
  disabled = false,
  onSelect,
  icon
}: ActionMenuItemProps) {
  return (
    <DropdownMenuItem
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        destructive ? "text-destructive focus:bg-destructive/10" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
      onSelect={(event) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        onSelect?.()
      }}
      disabled={disabled}
    >
      {icon}
      <span>{children}</span>
    </DropdownMenuItem>
  )
}
