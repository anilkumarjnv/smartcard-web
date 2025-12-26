// src/components/profile/shapes/LayeredWavesShape.tsx
interface ShapeProps {
    color: string;
}

export function LayeredWavesShape({ color }: ShapeProps) {
    return (
        <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 absolute bottom-0 left-0"
            style={{ transform: 'translateY(1px)' }}
        >
            {/* Back wave - more transparent */}
            <path
                d="M0,40 C200,70 400,10 600,40 C800,70 1000,10 1200,40 L1200,120 L0,120 Z"
                fill={color}
                opacity="0.3"
            />
            {/* Middle wave */}
            <path
                d="M0,50 C150,85 350,15 600,50 C850,85 1050,15 1200,50 L1200,120 L0,120 Z"
                fill={color}
                opacity="0.6"
            />
            {/* Front wave - solid */}
            <path
                d="M0,60 C150,95 350,25 600,60 C850,95 1050,25 1200,60 L1200,120 L0,120 Z"
                fill={color}
            />
        </svg>
    );
}
