import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-mono font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'bg-cyber-purple-600 text-white border-cyber-purple-600 hover:bg-cyber-purple-500 hover:border-cyber-purple-500 hover:shadow-[0_0_10px_var(--cyber-purple-300)]',
        destructive: 'bg-red-600 text-white border-red-600 hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]',
        outline: 'border border-cyber-purple-600 bg-cyber-black text-cyber-purple-200 hover:bg-cyber-purple-900 hover:border-cyber-purple-500 hover:shadow-[0_0_10px_var(--cyber-purple-300)]',
        secondary: 'bg-cyber-purple-900 text-cyber-purple-200 border-cyber-purple-700 hover:bg-cyber-purple-800 hover:border-cyber-purple-600',
        ghost: 'border-transparent hover:bg-cyber-purple-900 hover:text-cyber-purple-200',
        link: 'text-cyber-purple-300 underline-offset-4 hover:text-cyber-purple-200 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
