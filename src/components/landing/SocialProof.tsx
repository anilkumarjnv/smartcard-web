'use client';

import { motion } from 'framer-motion';

const avatars = [
    { color: 'bg-neutral-400 dark:bg-neutral-600' },
    { color: 'bg-neutral-500 dark:bg-neutral-500' },
    { color: 'bg-neutral-600 dark:bg-neutral-400' },
    { color: 'bg-neutral-700 dark:bg-neutral-300' },
    { color: 'bg-neutral-500 dark:bg-neutral-500' },
    { color: 'bg-neutral-400 dark:bg-neutral-600' },
];

export function SocialProof() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
        >
            {/* Avatar row */}
            <div className="flex -space-x-2">
                {avatars.map((avatar, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`w-10 h-10 rounded-full border-2 border-background dark:border-neutral-900 ${avatar.color}`}
                    />
                ))}
            </div>

            {/* Text */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-md">
                Join 500+ architects, developers, and designers building their future.
            </p>
        </motion.div>
    );
}
