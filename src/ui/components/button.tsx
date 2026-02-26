import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium leading-none transition-[color,background-color,border-color,box-shadow] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35',
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-primary/92',
        outline: 'border border-border bg-card text-foreground hover:bg-muted/70',
        ghost: 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
        secondary: 'border border-border/80 bg-secondary text-secondary-foreground hover:bg-secondary/78',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3 text-sm',
        xs: 'h-8 px-2.5 text-xs',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      })
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
