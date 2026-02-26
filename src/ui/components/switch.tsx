import * as React from 'react'
import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@/shared/cn'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5 transition-colors',
      'bg-muted data-[checked]:bg-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'block h-7 w-7 rounded-full bg-card shadow-[0_2px_6px_rgba(15,23,42,0.2)] transition-transform',
        'data-[checked]:translate-x-6'
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'

export { Switch }
