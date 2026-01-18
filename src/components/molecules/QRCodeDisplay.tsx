'use client';

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { QRCode } from 'react-qrcode-logo';

export type QRStyle = 'squares' | 'dots' | 'fluid';
export type EyeStyle = 'square' | 'circle';

export interface QRCodeTheme {
  bgColor: string;
  fgColor: string;
  eyeColor?: string;
  qrStyle: QRStyle;
  eyeStyle: EyeStyle;
  eyeRadius?: number;
}

// Predefined modern QR code themes
export const qrThemes: Record<string, QRCodeTheme> = {
  classic: {
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    qrStyle: 'squares',
    eyeStyle: 'square',
  },
  modern: {
    bgColor: '#FFFFFF',
    fgColor: '#1a1a1a',
    eyeColor: '#000000',
    qrStyle: 'dots',
    eyeStyle: 'circle',
    eyeRadius: 12,
  },
  rounded: {
    bgColor: '#FFFFFF',
    fgColor: '#374151',
    eyeColor: '#111827',
    qrStyle: 'fluid',
    eyeStyle: 'circle',
    eyeRadius: 16,
  },
  gradient: {
    bgColor: '#FFFFFF',
    fgColor: '#6366f1',
    eyeColor: '#4f46e5',
    qrStyle: 'dots',
    eyeStyle: 'circle',
    eyeRadius: 10,
  },
  ocean: {
    bgColor: '#FFFFFF',
    fgColor: '#0ea5e9',
    eyeColor: '#0284c7',
    qrStyle: 'dots',
    eyeStyle: 'circle',
    eyeRadius: 12,
  },
  forest: {
    bgColor: '#FFFFFF',
    fgColor: '#22c55e',
    eyeColor: '#16a34a',
    qrStyle: 'fluid',
    eyeStyle: 'circle',
    eyeRadius: 14,
  },
  sunset: {
    bgColor: '#FFFFFF',
    fgColor: '#f97316',
    eyeColor: '#ea580c',
    qrStyle: 'dots',
    eyeStyle: 'circle',
    eyeRadius: 10,
  },
  royal: {
    bgColor: '#FFFFFF',
    fgColor: '#8b5cf6',
    eyeColor: '#7c3aed',
    qrStyle: 'fluid',
    eyeStyle: 'circle',
    eyeRadius: 12,
  },
  minimal: {
    bgColor: '#f8fafc',
    fgColor: '#64748b',
    eyeColor: '#475569',
    qrStyle: 'squares',
    eyeStyle: 'circle',
    eyeRadius: 8,
  },
  dark: {
    bgColor: '#1f2937',
    fgColor: '#f9fafb',
    eyeColor: '#ffffff',
    qrStyle: 'dots',
    eyeStyle: 'circle',
    eyeRadius: 12,
  },
};

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  theme?: keyof typeof qrThemes | QRCodeTheme;
  logoUrl?: string;
  logoSize?: number;
  showThemeSelector?: boolean;
  onThemeChange?: (theme: keyof typeof qrThemes) => void;
}

export interface QRCodeDisplayRef {
  downloadQR: (filename?: string) => void;
}

export const QRCodeDisplay = forwardRef<QRCodeDisplayRef, QRCodeDisplayProps>(
  ({ url, size = 200, theme = 'modern', logoUrl, logoSize = 40, showThemeSelector = false, onThemeChange }, ref) => {
    const qrRef = useRef<QRCode>(null);

    const currentTheme: QRCodeTheme = typeof theme === 'string' ? qrThemes[theme] : theme;

    // Expose download method via ref
    useImperativeHandle(ref, () => ({
      downloadQR: (filename = 'cardfil-qr.png') => {
        if (qrRef.current) {
          (qrRef.current as any).download('png', filename);
        }
      }
    }));

    return (
      <div className="flex flex-col items-center gap-4">
        {/* QR Code Container */}
        <div
          className="p-4 rounded-2xl shadow-sm border-2 transition-all duration-300"
          style={{
            backgroundColor: currentTheme.bgColor,
            borderColor: currentTheme.bgColor === '#FFFFFF' || currentTheme.bgColor === '#f8fafc'
              ? '#e5e7eb'
              : currentTheme.fgColor + '30'
          }}
        >
          <QRCode
            ref={qrRef}
            value={url}
            size={size}
            bgColor={currentTheme.bgColor}
            fgColor={currentTheme.fgColor}
            qrStyle={currentTheme.qrStyle}
            eyeColor={currentTheme.eyeColor || currentTheme.fgColor}
            eyeRadius={currentTheme.eyeRadius || 0}
            logoImage={logoUrl}
            logoWidth={logoSize}
            logoHeight={logoSize}
            logoPadding={4}
            logoPaddingStyle="circle"
            removeQrCodeBehindLogo={true}
            quietZone={0}
            ecLevel="M"
          />
        </div>

        {/* Theme Selector */}
        {showThemeSelector && onThemeChange && (
          <div className="w-full">
            <p className="text-xs font-medium text-muted-foreground mb-2 text-center">QR Style</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(qrThemes).map((themeName) => {
                const t = qrThemes[themeName];
                const isSelected = typeof theme === 'string' && theme === themeName;
                return (
                  <button
                    key={themeName}
                    onClick={() => onThemeChange(themeName as keyof typeof qrThemes)}
                    className={`
                      group relative w-8 h-8 rounded-lg border-2 transition-all duration-200
                      ${isSelected
                        ? 'ring-2 ring-offset-2 ring-accent scale-110'
                        : 'hover:scale-105 hover:shadow-md'
                      }
                    `}
                    style={{
                      backgroundColor: t.bgColor,
                      borderColor: t.fgColor + '40'
                    }}
                    title={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                  >
                    {/* Mini QR preview dots */}
                    <div className="absolute inset-1 grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`
                            ${t.qrStyle === 'dots' ? 'rounded-full' : t.qrStyle === 'fluid' ? 'rounded-sm' : ''}
                          `}
                          style={{
                            backgroundColor: i % 2 === 0 ? t.fgColor : 'transparent'
                          }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

QRCodeDisplay.displayName = 'QRCodeDisplay';
