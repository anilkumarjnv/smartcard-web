// src/components/profile/shapes/WaveShape.tsx
interface ShapeProps {
    color: string;
}

export function WaveShape({ color }: ShapeProps) {
    return (
        <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 absolute bottom-0 left-0"
            style={{ transform: 'translateY(1px)' }}
        >
            <path
                d="M0,30 C150,80 350,0 600,30 C850,60 1050,0 1200,30 L1200,120 L0,120 Z"
                fill={color}
            />
        </svg>
    );
}
