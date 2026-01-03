'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { PROFILE_THEMES } from '../CardPreview';

interface ThemeSelectorProps {
    selectedTheme?: 'light' | 'dark' | 'accent' | 'neutral';
    onThemeChange: (theme: 'light' | 'dark' | 'accent' | 'neutral') => void;
}

export function ThemeSelector({ selectedTheme = 'light', onThemeChange }: ThemeSelectorProps) {

    // Mapping themes to visual representation colors matches the Landing Page aesthetic
    const themeVisuals: Record<string, string> = {
        light: 'bg-white border-neutral-200 text-neutral-900',
        dark: 'bg-neutral-950 border-neutral-800 text-white',
        accent: 'bg-violet-600 border-violet-600 text-white',
        neutral: 'bg-neutral-500 border-neutral-500 text-white',
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    Color Theme
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Select a color palette for your card
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
                {PROFILE_THEMES.map((theme) => {
                    const visualClass = themeVisuals[theme.name];
                    const isSelected = selectedTheme === theme.name;

                    return (
                        <div key={theme.name} className="flex flex-col items-center gap-2">
                            <button
                                onClick={() => onThemeChange(theme.name)}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${visualClass} ${isSelected
                                        ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-neutral-900 scale-110'
                                        : 'hover:scale-105 opacity-90 hover:opacity-100 hover:shadow-md'
                                    }`}
                                aria-label={`Select ${theme.displayName} theme`}
                            >
                                {isSelected && (
                                    <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                                )}
                            </button>
                            <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                {theme.displayName}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
