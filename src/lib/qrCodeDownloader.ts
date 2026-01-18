'use client';

import { qrThemes, QRCodeTheme } from '@/components/molecules/QRCodeDisplay';

/**
 * Downloads a modern styled QR code as PNG
 * This creates a temporary container and renders the QR code with modern styling
 */
export async function downloadModernQRCode(
    url: string,
    filename: string = 'qr-code.png',
    theme: keyof typeof qrThemes | QRCodeTheme = 'modern',
    size: number = 400
): Promise<void> {
    // Dynamically import QRCode to avoid SSR issues
    const { QRCode } = await import('react-qrcode-logo');
    const React = await import('react');

    const currentTheme: QRCodeTheme = typeof theme === 'string' ? qrThemes[theme] : theme;

    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    // Create and render the QR code component
    const { createRoot } = await import('react-dom/client');

    return new Promise((resolve, reject) => {
        try {
            // Create a wrapper that will hold the QRCode ref
            const QRWrapper = () => {
                const qrRef = React.useRef<InstanceType<typeof QRCode> | null>(null);

                React.useEffect(() => {
                    // Wait a bit for the canvas to render
                    const timer = setTimeout(() => {
                        if (qrRef.current) {
                            try {
                                // Remove .png extension if present as react-qrcode-logo adds it
                                const cleanFilename = filename.replace(/\.png$/i, '');
                                qrRef.current.download('png', cleanFilename);
                                // Cleanup
                                setTimeout(() => {
                                    document.body.removeChild(container);
                                    resolve();
                                }, 100);
                            } catch (err) {
                                reject(err);
                            }
                        }
                    }, 200);

                    return () => clearTimeout(timer);
                }, []);

                return React.createElement(QRCode, {
                    ref: qrRef,
                    value: url,
                    size: size,
                    bgColor: currentTheme.bgColor,
                    fgColor: currentTheme.fgColor,
                    qrStyle: currentTheme.qrStyle,
                    eyeColor: currentTheme.eyeColor || currentTheme.fgColor,
                    eyeRadius: currentTheme.eyeRadius || 0,
                    quietZone: 20,
                    ecLevel: 'M',
                });
            };

            const root = createRoot(container);
            root.render(React.createElement(QRWrapper));

        } catch (error) {
            document.body.removeChild(container);
            reject(error);
        }
    });
}

/**
 * Simple download using native canvas export
 */
export function downloadQRFromCanvas(
    canvasElement: HTMLCanvasElement,
    filename: string = 'qr-code.png'
): void {
    const dataURL = canvasElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
