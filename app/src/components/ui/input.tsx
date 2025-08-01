import * as React from 'react';

import { cn } from '../../lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-none border border-cyber-purple-600 bg-cyber-black px-3 py-2 text-sm font-mono text-foreground shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-mono file:text-foreground placeholder:text-cyber-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple-300 focus-visible:border-cyber-purple-300 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
