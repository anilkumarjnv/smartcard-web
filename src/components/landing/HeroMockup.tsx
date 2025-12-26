'use client';

import { motion } from 'framer-motion';

export function HeroMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-md mx-auto"
        >
            {/* Soft gray backdrop */}
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl p-8 md:p-12">
                {/* Floating card UI */}
                <motion.div
                    className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg dark:shadow-neutral-900/50"
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Avatar placeholder */}
                        <div className="w-24 h-24 bg-gradient-to-br from-neutral-800 to-neutral-600 dark:from-neutral-600 dark:to-neutral-400 rounded-full" />

                        {/* Name and title */}
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                                Alex Morgan
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Product Designer</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">Design Studio</p>
                        </div>

                        {/* Contact buttons */}
                        <div className="flex gap-2 pt-2">
                            <div className="h-8 w-16 bg-neutral-900 dark:bg-white rounded-md" />
                            <div className="h-8 w-16 border border-neutral-200 dark:border-neutral-700 rounded-md" />
                        </div>

                        {/* Social links */}
                        <div className="flex gap-3 pt-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
