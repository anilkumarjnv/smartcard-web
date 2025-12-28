// src/components/ui/Avatar.tsx
/**
 * Avatar Component
 * 
 * Displays user avatar with fallback to initials.
 */

import React from 'react';

export interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
};

function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

export function Avatar({
    src,
    alt,
    name = '',
    size = 'md',
    className = '',
}: AvatarProps) {
    const initials = getInitials(name || alt || '??');

    return (
        <div
            className={`
        relative inline-flex items-center justify-center
        rounded-full overflow-hidden
        bg-gradient-to-br from-neutral-900 to-neutral-800
        ${sizeStyles[size]}
        ${className}
      `}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Hide image on error to show fallback
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                <span className="font-medium text-white">{initials}</span>
            )}
        </div>
    );
}
