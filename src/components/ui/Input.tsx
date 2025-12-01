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
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200
          ${hasError
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
                aria-invalid={hasError}
                aria-describedby={
                    error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                }
                {...props}
            />
            {error && (
                <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}
