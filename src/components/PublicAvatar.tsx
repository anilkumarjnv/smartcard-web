'use client';

import { Avatar } from '@/components/ui/Avatar';

interface PublicAvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function PublicAvatar({ src, name, size = 'xl', className }: PublicAvatarProps) {
    return <Avatar src={src} name={name} size={size} className={className} />;
}
