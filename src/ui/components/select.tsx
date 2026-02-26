import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/cn'
import { usePortalContainer } from '@/ui/components/portal-container'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-border/85 bg-secondary px-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
      'hover:border-foreground/22 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon className="flex text-muted-foreground">
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & { sideOffset?: number }
>(({ className, children, sideOffset = 6, ...props }, ref) => {
  const portalContainer = usePortalContainer()
  return (
    <SelectPrimitive.Portal container={portalContainer ?? undefined}>
      <SelectPrimitive.Positioner sideOffset={sideOffset} className="z-[2147483647] pointer-events-auto outline-none">
        <SelectPrimitive.Popup
          ref={ref}
          className={cn(
            'min-w-[12rem] overflow-hidden rounded-lg border border-foreground/24 bg-popover text-popover-foreground ring-1 ring-foreground/12',
            'shadow-[0_20px_50px_-34px_rgba(15,23,42,0.65)]',
            className
          )}
          {...props}
        >
          <SelectPrimitive.List className="max-h-72 overflow-y-auto p-1">{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-2.5 pr-2.5 text-sm outline-none',
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
