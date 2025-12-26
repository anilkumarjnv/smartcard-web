'use client';

import { motion } from 'framer-motion';
import { FileText, Link2, Mail, AlertCircle, QrCode } from 'lucide-react';

export function BeforeAfter() {
    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - The Old Way */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-xl p-8 md:p-10 bg-neutral-50 dark:bg-neutral-900/40
 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
            >
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">The Old Way</h3>

                    {/* Chaotic stack of icons */}
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="flex items-center gap-3 opacity-70">
                            <FileText className="w-8 h-8 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Resume_v3_final.pdf</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-70">
                            <Link2 className="w-8 h-8 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">linkedin.com/in/...</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-70">
                            <Mail className="w-8 h-8 text-green-500 dark:text-green-400" strokeWidth={1.5} />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">contact@email.com</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-70">
                            <AlertCircle className="w-8 h-8 text-orange-500 dark:text-orange-400" strokeWidth={1.5} />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Broken portfolio link</span>
                        </div>
                    </div>

                    <p className="text-center text-neutral-700 dark:text-neutral-300 font-medium">
                        Too many links. No single place. Easy to forget.
                    </p>
                </div>
            </motion.div>

            {/* Right Column - The New Way */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-xl p-8 md:p-10 border-1 border border-neutral-200 dark:border-neutral-700
"

            >
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">The New Way</h3>

                    {/* Clean QR and URL */}
                    <div className="flex flex-col items-center gap-6 py-8">
                        <div className="w-32 h-32 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                            <QrCode className="w-24 h-24 text-white dark:text-neutral-900" strokeWidth={1.5} />
                        </div>

                        <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-6 py-3">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                yourname.com/me
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-neutral-700 dark:text-neutral-300 font-medium">
                        Everything about you, in one place.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
