'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';

const useCases = [
    {
        icon: GraduationCap,
        header: 'For Students',
        title: 'Final-Year / Early Career',
        context: 'Present your work, and credentails to recruiters. One profile for applications, networking, and career developement',
    },
    {
        icon: Briefcase,
        header: 'For Professionals',
        title: 'Freelancers / Independent Workers',
        context: 'Maintain a single point of contact. share work samples, availability, and credentials with clients.',
    },
];

export function UseCaseCards() {
    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
                <motion.div
                    key={useCase.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 md:p-10 hover:shadow-sm dark:hover:shadow-neutral-800/50 transition-shadow"
                >
                    <div className="space-y-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                            <useCase.icon className="w-6 h-6 text-neutral-900 dark:text-white" strokeWidth={1.5} />
                        </div>

                        {/* Header */}
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            {useCase.header}
                        </h3>

                        {/* Title */}
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                            {useCase.title}
                        </p>

                        {/* Context */}
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {useCase.context}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
