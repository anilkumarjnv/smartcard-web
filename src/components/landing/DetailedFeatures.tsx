'use client';

import { motion } from 'framer-motion';
import {
    Users,
    BarChart3,
    Palette,
    ArrowRight,
    CheckCircle2,
    TrendingUp,
    Layout
} from 'lucide-react';

const features = [
    {
        id: 'leads',
        title: 'Bridge the post-meeting gap',
        subtitle: 'Lead Capture Layer',
        description: 'Don\'t let the connection die after the handshake. Capture leads instantly when they view your card, creating a lightweight visibility layer for your business.',
        highlights: [
            'One-tap contact collection',
            'Visitor interest signals',
            'Real-time lead notifications'
        ],
        icon: Users,
        color: 'blue',
        visual: <LeadsVisual />
    },
    {
        id: 'analytics',
        title: 'Understand your impact',
        subtitle: 'Advanced Analytics',
        description: 'Get deep insights into who\'s viewing your card, which links they click, and how your network is growing over time.',
        highlights: [
            'Daily view trends',
            'Link click tracking',
            'Geographic insights'
        ],
        icon: BarChart3,
        color: 'indigo',
        visual: <AnalyticsVisual />
    },
    {
        id: 'customization',
        title: 'Uniquely yours',
        subtitle: 'Deep Customization',
        description: 'Don\'t settle for generic. Customize every aspect of your card from themes and colors to button shapes and fonts.',
        highlights: [
            'Premium dark/light themes',
            'Custom shape dividers',
            'Personal branding friendly'
        ],
        icon: Palette,
        color: 'purple',
        visual: <CustomizationVisual />
    }
];

export function DetailedFeatures() {
    return (
        <div className="flex flex-col gap-24 lg:gap-32">
            {features.map((feature, index) => (
                <FeatureSection key={feature.id} feature={feature} index={index} />
            ))}
        </div>
    );
}

const colorClasses: Record<string, { bg: string; text: string; check: string }> = {
    blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
        check: "text-blue-500"
    },
    indigo: {
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        text: "text-indigo-600 dark:text-indigo-400",
        check: "text-indigo-500"
    },
    purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
        check: "text-purple-500"
    }
};

function FeatureSection({ feature, index }: { feature: typeof features[0], index: number }) {
    const isEven = index % 2 === 0;
    const colors = colorClasses[feature.color];

    return (
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-8"
            >
                <div className="space-y-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-medium`}>
                        {/* <feature.icon size={16} /> */}
                        {feature.subtitle}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
                        {feature.title}
                    </h3>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {feature.description}
                    </p>
                </div>

                <ul className="space-y-3">
                    {feature.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                            <CheckCircle2 className={`w-5 h-5 ${colors.check} shrink-0`} />
                            <span>{highlight}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Visual Component */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full"
            >
                <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                    {feature.visual}

                    {/* Gradient Overlay for aesthetic */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-100/20 to-transparent dark:from-neutral-900/20" />
                </div>
            </motion.div>
        </div>
    );
}

// --- Visual Components ---

function LeadsVisual() {
    const leads = [
        { name: 'Sarah Wilson', email: 'sarah.w@design.co', time: '2m ago' },
        { name: 'Michael Chen', email: 'm.chen@tech.inc', time: '1h ago' },
        { name: 'David Miller', email: 'david@studio.io', time: '3h ago' },
    ];

    return (
        <div className="w-full h-full p-8 md:p-12 flex items-center justify-center bg-blue-50/50 dark:bg-blue-950/10">
            <div className="w-full max-w-sm bg-white dark:bg-neutral-950 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
                    <span className="font-semibold text-neutral-900 dark:text-white">Recent Leads</span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">New +3</span>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {leads.map((lead, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 + 0.5 }}
                            className="p-4 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold text-sm">
                                {lead.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{lead.name}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{lead.email}</p>
                            </div>
                            <span className="text-xs text-neutral-400 whitespace-nowrap">{lead.time}</span>
                        </motion.div>
                    ))}
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900/50 text-center">
                    <span className="text-xs font-medium text-neutral-500 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors">View all leads →</span>
                </div>
            </div>
        </div>
    );
}

function AnalyticsVisual() {
    return (
        <div className="w-full h-full p-8 md:p-12 flex items-center justify-center bg-indigo-50/50 dark:bg-indigo-950/10">
            <div className="w-full max-w-sm bg-white dark:bg-neutral-950 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Total Views</p>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">1,248</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                        <TrendingUp size={14} />
                        <span>+12.5%</span>
                    </div>
                </div>

                {/* Simplified Bar Chart Simulation */}
                <div className="h-32 flex items-end gap-2 justify-between">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-md relative group"
                        >
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-indigo-500 dark:bg-indigo-400 rounded-t-md"
                                style={{ height: '100%' }} // Full height of the container which is already sized
                            />
                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {height * 10} views
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-neutral-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
            </div>
        </div>
    );
}

function CustomizationVisual() {
    const themes = [
        { color: 'bg-neutral-900', border: 'border-neutral-900' },
        { color: 'bg-blue-600', border: 'border-blue-600' },
        { color: 'bg-emerald-600', border: 'border-emerald-600' },
        { color: 'bg-violet-600', border: 'border-violet-600' },
    ];

    return (
        <div className="w-full h-full p-8 md:p-12 flex items-center justify-center bg-purple-50/50 dark:bg-purple-950/10">
            <div className="relative w-full max-w-[280px]">
                {/* Mock Card */}
                <motion.div
                    animate={{ rotate: -5 }}
                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg opacity-40 translate-x-4 translate-y-2"
                />
                <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                    {/* Header Image Area */}
                    <div className="h-24 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                            <div className="w-16 h-16 rounded-full border-4 border-white dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-800" />
                        </div>
                    </div>

                    <div className="pt-10 pb-6 px-6 text-center space-y-3">
                        <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                        <div className="h-3 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded mx-auto" />

                        <div className="flex gap-2 justify-center mt-6">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                        </div>

                        {/* Theme Picker Mockup */}
                        <div className="mt-8 p-3 bg-neutral-50 dark:bg-neutral-900/80 rounded-xl border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-semibold">Select Theme</p>
                            <div className="flex justify-center gap-2">
                                {themes.map((t, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.2 }}
                                        className={`w-6 h-6 rounded-full ${t.color} cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-neutral-200 dark:hover:ring-neutral-700`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
