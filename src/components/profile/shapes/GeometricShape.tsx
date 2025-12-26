// src/components/profile/shapes/GeometricShape.tsx
interface ShapeProps {
    color: string;
}

export function GeometricShape({ color }: ShapeProps) {
    return (
        <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 absolute bottom-0 left-0"
            style={{ transform: 'translateY(1px)' }}
        >
            <path
                d="M0,0 L1200,60 L1200,120 L0,120 Z"
                fill={color}
            />
        </svg>
    );
}
