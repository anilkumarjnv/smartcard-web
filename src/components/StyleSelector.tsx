'use client';

import { useState } from 'react';
import { cardStyles, type CardStyle } from '@/lib/themes';

interface StyleSelectorProps {
    selectedStyle: CardStyle;
    onStyleChange: (style: CardStyle) => void;
}

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Card Style</h3>
                <p className="text-xs text-gray-600 mb-4">Choose a layout style for your card</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.values(cardStyles).map((style) => (
                    <button
                        key={style.id}
                        onClick={() => onStyleChange(style.id)}
                        className={`relative group text-left transition-all duration-200 rounded-lg border-2 p-3 ${
                            selectedStyle === style.id
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {selectedStyle === style.id && (
                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-900">{style.name}</h4>
                            <p className="text-xs text-gray-600 line-clamp-2">{style.description}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                <span>{style.preview}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

