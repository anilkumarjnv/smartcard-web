// src/components/ui/Card.tsx
/**
 * Card Component
 * 
 * Container component with shadow, border, and padding.
 * Used for grouping related content.
 */

import React from 'react';

export interface CardProps {
    className?: string;
    children: React.ReactNode;
    hoverable?: boolean;
}

export function Card({ className = '', children, hoverable = false }: CardProps) {
    return (
        <div
            className={`
        bg-card rounded-2xl border border-border shadow-sm
        ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className = '', children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`px-6 py-4 border-b border-border ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ className = '', children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ className = '', children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`px-6 py-4 border-t border-border bg-muted/50 rounded-b-2xl ${className}`}>
            {children}
        </div>
    );
}
