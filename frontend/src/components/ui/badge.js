import React from 'react';
import { cn } from '@/lib/utils';

const Badge = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
    outline: 'text-slate-700 border-slate-300',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };

