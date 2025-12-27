// src/components/profile/ShapeSelector.tsx
'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

export type ProfileCardShape = 'wave' | 'geometric' | 'soft-arc' | 'layered-waves' | 'slant';

interface ShapeSelectorProps {
    selectedShape?: ProfileCardShape;
    onShapeChange: (shape: ProfileCardShape) => void;
}

const SHAPE_OPTIONS = [
    {
        name: 'wave' as ProfileCardShape,
        displayName: 'Wave',
        description: 'Smooth, flowing transition',
        useCase: 'Classic & Professional',
    },
    {
        name: 'geometric' as ProfileCardShape,
        displayName: 'Geometric',
        description: 'Angular, modern design',
        useCase: 'Tech & Innovation',
    },
    {
        name: 'soft-arc' as ProfileCardShape,
        displayName: 'Soft Arc',
        description: 'Gentle curved transition',
        useCase: 'Creative & Approachable',
    },
    {
        name: 'layered-waves' as ProfileCardShape,
        displayName: 'Layered Waves',
        description: 'Overlapping waves with depth',
        useCase: 'Dynamic & Multi-faceted',
    },
    {
        name: 'slant' as ProfileCardShape,
        displayName: 'Slant',
        description: 'Bold diagonal cut',
        useCase: 'Straightforward & Direct',
    },
];

export function ShapeSelector({ selectedShape = 'wave', onShapeChange }: ShapeSelectorProps) {
    const [hoveredShape, setHoveredShape] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    Choose Your Shape
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Select a divider shape that matches your style
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {SHAPE_OPTIONS.map((shape) => {
                    const isSelected = selectedShape === shape.name;
                    const isHovered = hoveredShape === shape.name;

                    return (
                        <button
                            key={shape.name}
                            onClick={() => onShapeChange(shape.name)}
                            onMouseEnter={() => setHoveredShape(shape.name)}
                            onMouseLeave={() => setHoveredShape(null)}
                            className={`relative p-0 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                                ? 'border-neutral-900 dark:border-neutral-100 shadow-lg bg-neutral-50 dark:bg-neutral-800/50'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900'
                                }`}
                        >
                            {/* Selected Indicator */}
                            {/* {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-neutral-900 dark:bg-neutral-100 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white dark:text-neutral-900" strokeWidth={3} />
                                </div>
                            )} */}

                            {/* Shape Preview */}
                            <div className="mb-0 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden relative">
                                <ShapePreview shape={shape.name} />
                            </div>

                            {/* Shape Info */}
                            {/* <div>
                                <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">
                                    {shape.displayName}
                                </h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                    {shape.description}
                                </p>
                                <p className="text-xs text-neutral-900 dark:text-neutral-200 font-medium">
                                    {shape.useCase}
                                </p>
                            </div> */}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// Mini preview component
function ShapePreview({ shape }: { shape: ProfileCardShape }) {
    const color = '#4F46E5'; // Indigo color for preview

    switch (shape) {
        case 'wave':
            return (
                <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full h-full">
                    <path
                        d="M0,10 C15,25 35,0 60,10 C85,20 105,0 120,10 L120,40 L0,40 Z"
                        fill={color}
                    />
                </svg>
            );
        case 'geometric':
            return (
                <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,0 L120,20 L120,40 L0,40 Z" fill={color} />
                </svg>
            );
        case 'soft-arc':
            return (
                <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,20 Q60,0 120,20 L120,40 L0,40 Z" fill={color} />
                </svg>
            );
        case 'layered-waves':
            return (
                <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full h-full">
                    <path
                        d="M0,15 C20,25 40,5 60,15 C80,25 100,5 120,15 L120,40 L0,40 Z"
                        fill={color}
                        opacity="0.3"
                    />
                    <path
                        d="M0,20 C15,30 35,10 60,20 C85,30 105,10 120,20 L120,40 L0,40 Z"
                        fill={color}
                        opacity="0.6"
                    />
                    <path
                        d="M0,25 C15,35 35,15 60,25 C85,35 105,15 120,25 L120,40 L0,40 Z"
                        fill={color}
                    />
                </svg>
            );
        case 'slant':
            return (
                <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,30 L120,10 L120,40 L0,40 Z" fill={color} />
                </svg>
            );
    }
}
