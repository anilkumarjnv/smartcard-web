'use client';

import { fonts, type FontOption } from '@/lib/themes';

interface FontSelectorProps {
    selectedFontId: string;
    onFontChange: (fontId: string) => void;
}

export function FontSelector({ selectedFontId, onFontChange }: FontSelectorProps) {
    const fontCategories = {
        'sans-serif': fonts.filter(f => f.category === 'sans-serif'),
        'serif': fonts.filter(f => f.category === 'serif'),
        'display': fonts.filter(f => f.category === 'display'),
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Font Family</h3>
                <p className="text-xs text-gray-600 mb-4">Choose a font that matches your style</p>
            </div>
            <div className="space-y-4">
                {Object.entries(fontCategories).map(([category, categoryFonts]) => (
                    categoryFonts.length > 0 && (
                        <div key={category}>
                            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
                                {category === 'sans-serif' ? 'Sans Serif' : category === 'serif' ? 'Serif' : 'Display'}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {categoryFonts.map((font) => {
                                    const isSelected = selectedFontId === font.id;
                                    return (
                                        <button
                                            key={font.id}
                                            onClick={() => onFontChange(font.id)}
                                            className={`relative group text-left transition-all duration-200 rounded-lg border-2 p-3 ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-sm text-gray-900" style={{ fontFamily: font.family }}>
                                                    {font.name}
                                                </h4>
                                                <p className="text-xs text-gray-600">{font.description}</p>
                                                <p
                                                    className="text-sm text-gray-800 mt-2"
                                                    style={{ fontFamily: font.family }}
                                                >
                                                    The quick brown fox jumps over the lazy dog
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

