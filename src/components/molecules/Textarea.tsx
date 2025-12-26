import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 px-1 text-sm font-medium text-foreground-secondary">{label}</label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 rounded-2xl border-2 border-border bg-card text-foreground transition-all duration-200 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 resize-none',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-destructive px-4">{error}</p>
      )}
    </div>
  );
}

