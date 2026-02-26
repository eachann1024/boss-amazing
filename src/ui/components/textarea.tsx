import * as React from 'react'
import { cn } from '@/shared/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors placeholder:text-muted-foreground',
        'hover:border-border/90 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
