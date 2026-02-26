import * as React from 'react'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { cn } from '@/shared/cn'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, ...props }, ref) => {
  const current = (value ?? defaultValue ?? [0]) as readonly number[]

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      <SliderPrimitive.Control className="flex w-full items-center py-2">
        <SliderPrimitive.Track className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Indicator className="absolute h-full rounded-full bg-primary" />
          {current.map((_, index) => (
            <SliderPrimitive.Thumb
              key={`thumb-${index}`}
              index={index}
              className="block h-[18px] w-[18px] rounded-full border border-primary/20 bg-card shadow-[0_2px_6px_rgba(15,23,42,0.22)]"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
})
Slider.displayName = 'Slider'

export { Slider }
