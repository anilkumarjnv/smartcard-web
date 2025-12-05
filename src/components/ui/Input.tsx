// src/components/ui/Input.tsx
/**
 * Input Component
 * 
 * Form input with label, error states, and validation messages.
 * Accessible with proper ARIA attributes.
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Input({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: InputProps) {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasError = !!error;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-3 py-2 border rounded-xl bg-background
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200
          ${hasError
                        ? 'border-destructive focus:ring-destructive focus:border-destructive'
                        : 'border-input focus:ring-ring focus:border-ring'
                    }
          disabled:bg-muted disabled:cursor-not-allowed
          ${className}
        `}
                aria-invalid={hasError}
                aria-describedby={
                    error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                }
                {...props}
            />
            {error && (
                <p id={`${inputId}-error`} className="mt-1 text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p id={`${inputId}-helper`} className="mt-1 text-sm text-muted-foreground">
                    {helperText}
                </p>
            )}
        </div>
    );
}
