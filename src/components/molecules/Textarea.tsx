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
        <label className="block mb-2 px-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 resize-none',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500 px-4">{error}</p>
      )}
    </div>
  );
}

