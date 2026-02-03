'use client';

import { motion } from 'framer-motion';
import { Briefcase, RefreshCw, QrCode, LineChart } from 'lucide-react';

const features = [

    {
        icon: LineChart,
        title: 'Visibility Insights',
        description: 'See when people view your profile and from where.',
        visual: (
            <div className="flex items-end justify-center gap-1 h-10 pb-1">
                <div className="w-2 bg-neutral-200 dark:bg-neutral-800 h-4 rounded-sm" />
                <div className="w-2 bg-neutral-300 dark:bg-neutral-700 h-6 rounded-sm" />
                <div className="w-2 bg-neutral-900 dark:bg-white h-8 rounded-sm" />
                <div className="w-2 bg-neutral-300 dark:bg-neutral-700 h-5 rounded-sm" />
                <div className="w-2 bg-neutral-200 dark:bg-neutral-800 h-3 rounded-sm" />
            </div>
        ),
    },
    {
        icon: RefreshCw,
        title: 'Live Updates',
        description: 'Real-time changes. No more obsolete business cards.',
        visual: (
            <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
            </div>
        ),
    },
    {
        icon: Briefcase,
        title: 'Mini Portfolio',
        description: 'A clear snapshot of what you’ve built.',
        visual: (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-400" />
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded flex-1" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-400" />
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-400" />
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/5" />
                </div>
            </div>
        ),
    },

    {
        icon: QrCode,
        title: 'Instant QR',
        description: 'Share your profile instantly, without typing.',
        visual: (
            <div className="flex justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" className="text-neutral-900 dark:text-white">
                    <rect x="0" y="0" width="12" height="12" fill="currentColor" />
                    <rect x="16" y="0" width="12" height="12" fill="currentColor" />
                    <rect x="36" y="0" width="12" height="12" fill="currentColor" />
                    <rect x="52" y="0" width="12" height="12" fill="currentColor" />

                    <rect x="0" y="16" width="12" height="12" fill="currentColor" />
                    <rect x="36" y="16" width="12" height="12" fill="currentColor" />

                    <rect x="0" y="36" width="12" height="12" fill="currentColor" />
                    <rect x="36" y="36" width="12" height="12" fill="currentColor" />

                    <rect x="0" y="52" width="12" height="12" fill="currentColor" />
                    <rect x="16" y="52" width="12" height="12" fill="currentColor" />
                    <rect x="36" y="52" width="12" height="12" fill="currentColor" />
                    <rect x="52" y="52" width="12" height="12" fill="currentColor" />

                    <rect x="20" y="20" width="24" height="24" fill="currentColor" />
                </svg>
            </div>
        ),
    },

];

export function FeatureGrid() {
    return (
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
                <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 hover:shadow-sm dark:hover:shadow-neutral-800/50 transition-shadow"
                >
                    {/* Text at top */}
                    <div className="space-y-2 mb-8">
                        <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                            {feature.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                    </div>

                    {/* Visual at bottom (Restored) */}
                    {/* <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-center mt-auto">
                        {feature.visual}
                    </div> */}
                </motion.div>
            ))}
        </div>
    );
}
