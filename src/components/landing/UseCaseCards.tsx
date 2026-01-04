'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, LineChart } from 'lucide-react';

const useCases = [
    {
        icon: LineChart,
        header: 'For Founders',
        title: 'Business Owners & Executives',
        context: 'The lightweight lead layer. See who views your card, track interest locations, and never lose a potential connection after a meeting.',
    },
    {
        icon: Briefcase,
        header: 'For Professionals',
        title: 'Freelancers & Creators',
        context: 'Maintain a single point of contact. Showcase your portfolio, share availability, and build credibility with clients.',
    },
    {
        icon: GraduationCap,
        header: 'For Students',
        title: 'Final-Year / Early Career',
        context: 'Present your work and credentials to recruiters. One professional profile for applications, networking, and career development.',
    },
];

export function UseCaseCards() {
    return (
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {useCases.map((useCase, index) => (
                <motion.div
                    key={useCase.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 hover:shadow-sm dark:hover:shadow-neutral-800/50 transition-shadow"
                >
                    <div className="space-y-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                            <useCase.icon className="w-6 h-6 text-neutral-900 dark:text-white" strokeWidth={1.5} />
                        </div>

                        {/* Header */}
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            {useCase.header}
                        </h3>

                        {/* Title */}
                        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                            {useCase.title}
                        </p>

                        {/* Context */}
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {useCase.context}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
