// src/components/ui/Container.tsx
/**
 * Container Component
 * 
 * Max-width container for page content.
 * Centers content and adds horizontal padding.
 */

import React from 'react';

export interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeStyles = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-full',
};

export function Container({ children, className = '', size = 'lg' }: ContainerProps) {
    return (
        <div className={`${sizeStyles[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
}
