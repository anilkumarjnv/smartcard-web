'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 rounded-2xl border-2 border-border bg-card text-foreground transition-all duration-200 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10',
            icon && 'pl-12',
            error && 'border-destructive',
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props.onChange?.(e);
          }}
          {...props}
        />
        {label && (
          <label
            className={cn(
              'absolute transition-all duration-200 pointer-events-none',
              icon ? 'left-12' : 'left-4',
              isFocused || hasValue || props.value
                ? '-top-2 text-xs bg-card px-2 text-accent'
                : 'top-1/2 -translate-y-1/2 text-muted-foreground'
            )}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive px-4">{error}</p>
      )}
    </div>
  );
}

